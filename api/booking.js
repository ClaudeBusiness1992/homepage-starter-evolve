// Vercel Serverless Function: api/booking
// Receives booking submissions, creates Google Calendar event (if Live-Sync enabled)
// Includes: rate-limiting (per IP), honeypot bot-check, time-based bot-check

import crypto from 'node:crypto';

// In-memory rate limit (resets on cold start; combined with honeypot/time-check sufficient for small business)
const ipRequests = new Map();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip) {
  const now = Date.now();
  const requests = (ipRequests.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  if (requests.length >= RATE_LIMIT) return false;
  requests.push(now);
  ipRequests.set(ip, requests);
  return true;
}

// Sign JWT with private key (Google service-account auth, no extra deps)
function signJwt(claims, privateKeyPem) {
  const header = { alg: 'RS256', typ: 'JWT' };
  const enc = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');
  const data = `${enc(header)}.${enc(claims)}`;
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(data);
  signer.end();
  const signature = signer.sign(privateKeyPem).toString('base64url');
  return `${data}.${signature}`;
}

// Get OAuth access token from service-account credentials
async function getAccessToken(credentials) {
  const now = Math.floor(Date.now() / 1000);
  const claims = {
    iss: credentials.client_email,
    scope: 'https://www.googleapis.com/auth/calendar.events',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  };
  const jwt = signJwt(claims, credentials.private_key);
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token exchange failed: ${res.status} ${text}`);
  }
  const json = await res.json();
  return json.access_token;
}

async function createCalendarEvent(accessToken, calendarId, event) {
  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?sendUpdates=all`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Calendar API failed: ${res.status} ${text}`);
  }
  return res.json();
}

export default async function handler(req, res) {
  // CORS / method check
  res.setHeader('Content-Type', 'application/json');
  if (req.method !== 'POST') {
    res.statusCode = 405;
    return res.end(JSON.stringify({ error: 'Method not allowed' }));
  }

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';

  // Rate limit
  if (!checkRateLimit(ip)) {
    res.statusCode = 429;
    return res.end(JSON.stringify({ error: 'Zu viele Anfragen. Bitte später erneut versuchen.' }));
  }

  // Parse body (Vercel auto-parses JSON for POST with content-type)
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  // Honeypot: hidden field "hp" must be empty (bots fill all fields)
  if (body.hp) {
    res.statusCode = 200; // pretend success to confuse bots
    return res.end(JSON.stringify({ ok: true, message: 'OK' }));
  }

  // Time check: form must have been on page >3s
  const ts = parseInt(body.ts, 10);
  if (!ts || Date.now() - ts < 3000) {
    res.statusCode = 400;
    return res.end(JSON.stringify({ error: 'Zu schnelles Formular. Bitte erneut versuchen.' }));
  }

  // Required fields
  const { service, staff, date, time, name, email, phone = '', note = '' } = body;
  if (!service || !staff || !date || !time || !name || !email) {
    res.statusCode = 400;
    return res.end(JSON.stringify({ error: 'Pflichtfelder fehlen.' }));
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.statusCode = 400;
    return res.end(JSON.stringify({ error: 'Ungültige E-Mail-Adresse.' }));
  }

  // Live-Sync: create Google Calendar event
  const saJson = process.env.GOOGLE_SA_JSON;
  const calendarId = body.calendarId || process.env.GOOGLE_CALENDAR_ID || '';

  if (!saJson || !calendarId) {
    // Live-Sync nicht konfiguriert → Erfolg melden, Logging
    console.log('Booking received (live-sync not configured):', { service, staff, date, time, name, email });
    res.statusCode = 200;
    return res.end(JSON.stringify({
      ok: true,
      message: 'Buchung empfangen. Hinweis: Live-Kalender-Sync ist nicht konfiguriert — bitte richten Sie GOOGLE_SA_JSON + GOOGLE_CALENDAR_ID in den Vercel-Environment-Variables ein.',
    }));
  }

  try {
    const credentials = JSON.parse(saJson);
    if (!credentials.client_email || !credentials.private_key) {
      throw new Error('GOOGLE_SA_JSON ist ungültig (client_email/private_key fehlt).');
    }

    const accessToken = await getAccessToken(credentials);

    const startISO = `${date}T${time}:00`;
    const startMs = new Date(startISO).getTime();
    if (isNaN(startMs)) throw new Error('Ungültiges Datum/Uhrzeit.');
    const endISO = new Date(startMs + 60 * 60_000).toISOString();

    await createCalendarEvent(accessToken, calendarId, {
      summary: `${service} — ${name}`,
      description: [
        `Mitarbeiter:in: ${staff}`,
        `Kunde: ${name}`,
        `E-Mail: ${email}`,
        `Telefon: ${phone || '—'}`,
        '',
        'Anmerkung:',
        note || '—',
      ].join('\n'),
      start: { dateTime: new Date(startMs).toISOString(), timeZone: 'Europe/Berlin' },
      end:   { dateTime: endISO, timeZone: 'Europe/Berlin' },
      attendees: [{ email, displayName: name }],
    });

    res.statusCode = 200;
    return res.end(JSON.stringify({
      ok: true,
      message: 'Termin erstellt. Sie erhalten in Kürze eine Kalender-Einladung per E-Mail.',
    }));
  } catch (err) {
    console.error('Booking error:', err);
    res.statusCode = 500;
    return res.end(JSON.stringify({ error: 'Fehler beim Erstellen des Termins. Bitte später erneut versuchen oder uns direkt kontaktieren.' }));
  }
}
