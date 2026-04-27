// Vercel Serverless Function: api/contact
// Receives contact-form submissions, sends e-mail via Resend (if configured),
// otherwise logs structured (no PII in default log).
// Includes: rate-limiting (per IP), honeypot bot-check, time-based bot-check.

const ipRequests = new Map();
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip) {
  const now = Date.now();
  const requests = (ipRequests.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  if (requests.length >= RATE_LIMIT) return false;
  requests.push(now);
  ipRequests.set(ip, requests);
  return true;
}

async function sendViaResend({ apiKey, from, to, subject, text, replyTo }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      text,
      reply_to: replyTo,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Resend failed: ${res.status} ${text}`);
  }
  return res.json();
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  if (req.method !== 'POST') {
    res.statusCode = 405;
    return res.end(JSON.stringify({ error: 'Method not allowed' }));
  }

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';

  if (!checkRateLimit(ip)) {
    res.statusCode = 429;
    return res.end(JSON.stringify({ error: 'Zu viele Anfragen. Bitte später erneut versuchen.' }));
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  // Honeypot
  if (body.hp) {
    res.statusCode = 200;
    return res.end(JSON.stringify({ ok: true }));
  }

  // Time check (form must be on page >2s)
  const ts = parseInt(body.ts, 10);
  if (!ts || Date.now() - ts < 2000) {
    res.statusCode = 400;
    return res.end(JSON.stringify({ error: 'Formular zu schnell abgesendet. Bitte erneut versuchen.' }));
  }

  const { name, email, phone = '', message } = body;
  if (!name || !email || !message) {
    res.statusCode = 400;
    return res.end(JSON.stringify({ error: 'Pflichtfelder fehlen.' }));
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.statusCode = 400;
    return res.end(JSON.stringify({ error: 'Ungültige E-Mail-Adresse.' }));
  }

  // Length validation
  const tooLong = (v, max) => typeof v === 'string' && v.length > max;
  if (tooLong(name, 120) || tooLong(email, 200) || tooLong(phone, 60) || tooLong(message, 5000)) {
    res.statusCode = 400;
    return res.end(JSON.stringify({ error: 'Eingaben zu lang.' }));
  }

  const subject = `Anfrage über Website: ${name}`;
  const text = [
    'Neue Kontaktanfrage über die Website:',
    '',
    `Name:    ${name}`,
    `E-Mail:  ${email}`,
    `Telefon: ${phone || '—'}`,
    '',
    'Nachricht:',
    message,
  ].join('\n');

  const apiKey = process.env.RESEND_API_KEY;
  const recipientTo = process.env.CONTACT_EMAIL_TO;
  const senderFrom = process.env.CONTACT_EMAIL_FROM;

  if (!apiKey || !recipientTo || !senderFrom) {
    // No mailer configured → return ok so user sees success, but log signal
    console.log('Contact received (mailer not configured)');
    res.statusCode = 200;
    return res.end(JSON.stringify({
      ok: true,
      message: 'Anfrage übermittelt. Hinweis: E-Mail-Versand nicht konfiguriert (siehe docs/CONTACT-SETUP.md).',
    }));
  }

  try {
    await sendViaResend({
      apiKey,
      from: senderFrom,
      to: recipientTo,
      subject,
      text,
      replyTo: email,
    });
    res.statusCode = 200;
    return res.end(JSON.stringify({
      ok: true,
      message: 'Nachricht erhalten! Wir melden uns innerhalb von 24 Stunden.',
    }));
  } catch (err) {
    console.error('Contact send error:', err.message);
    res.statusCode = 500;
    return res.end(JSON.stringify({
      error: 'Fehler beim Senden. Bitte direkt per E-Mail kontaktieren.',
    }));
  }
}
