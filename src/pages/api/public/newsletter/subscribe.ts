export const prerender = false;

import type { APIRoute } from 'astro';
import { getDb } from '../../../../lib/db';
import { randomToken, sha256 } from '../../../../lib/crypto';
import { checkRateLimit, mailerStatus, sendMail } from '../../../../lib/mailer';

export const POST: APIRoute = async ({ request }) => {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      'unknown';
    if (!checkRateLimit(ip)) {
      return new Response(
        JSON.stringify({ error: 'Zu viele Anfragen. Bitte später erneut versuchen.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const body = await request.json();
    const email = (body.email || '').trim().toLowerCase();
    const firstName = (body.firstName || '').trim();
    const honeypot = body.website || ''; // Bot-Falle
    const ts = parseInt(body.ts, 10);

    if (honeypot) {
      // Stille Erfolgsmeldung für Bots
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Zeitprüfung wie api/contact.js (Formular muss > 2 s geöffnet sein)
    if (body.ts !== undefined && (!ts || Date.now() - ts < 2000)) {
      return new Response(
        JSON.stringify({ error: 'Formular zu schnell abgesendet. Bitte erneut versuchen.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Gib eine E-Mail-Adresse mit @ ein.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }
    if (email.length > 200 || firstName.length > 120) {
      return new Response(
        JSON.stringify({ error: 'Eingaben zu lang.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const db = getDb();
    const existing = db
      .prepare('SELECT id, status FROM newsletter_subscribers WHERE email = ?')
      .get(email) as { id: string; status: string } | undefined;

    if (existing && existing.status === 'confirmed') {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Diese Adresse ist bereits für den Newsletter angemeldet.',
          mailConfigured: mailerStatus().configured,
        }),
        { headers: { 'Content-Type': 'application/json' } },
      );
    }

    const doiToken = randomToken(32);
    const doiTokenHash = sha256(doiToken);
    const unsubToken = randomToken(32);
    const unsubTokenHash = sha256(unsubToken);
    const id = existing?.id || 'sub-' + randomToken(6);
    const now = new Date().toISOString();

    db.prepare(
      `
      INSERT INTO newsletter_subscribers (id, email, first_name, status, doi_token_hash, unsubscribe_token_hash, consent_version, created_at)
      VALUES (?, ?, ?, 'pending', ?, ?, 'v1', ?)
      ON CONFLICT(email) DO UPDATE SET
        first_name = ?,
        status = 'pending',
        doi_token_hash = ?,
        created_at = ?
    `,
    ).run(id, email, firstName, doiTokenHash, unsubTokenHash, now, firstName, doiTokenHash, now);

    // Token-Ablage: nur SHA-256-Hash in SQLite-Tabelle newsletter_subscribers
    // (Spalte doi_token_hash), Klartext nur im Bestätigungslink der Mail.
    // Nach Bestätigung wird der Hash auf NULL gesetzt (einmalig verwendbar).
    const origin = new URL(request.url).origin;
    const confirmUrl = `${origin}/api/public/newsletter/confirm?token=${doiToken}`;

    const status = mailerStatus();
    if (status.configured) {
      try {
        await sendMail({
          to: email,
          subject: 'Bitte Newsletter-Anmeldung bestätigen',
          text: [
            'Guten Tag,',
            '',
            'bitte bestätige deine Newsletter-Anmeldung über diesen Link:',
            confirmUrl,
            '',
            'Der Link ist einmalig verwendbar. Ohne Bestätigung bleibt die Anmeldung inaktiv.',
            'Hinweis: E-Mail-Versand aktiv. Keine weiteren Aktionen nötig.',
          ].join('\n'),
        });
      } catch {
        // Nur Status melden, keine Inhalte.
        return new Response(
          JSON.stringify({ error: 'Fehler beim Senden. Bitte später erneut versuchen.' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } },
        );
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: status.configured
          ? 'Fast geschafft! Bitte bestätige deine Anmeldung über den Link in deinem Postfach.'
          : 'Anmeldung gespeichert. Hinweis: Der E-Mail-Versand ist derzeit nicht konfiguriert, daher kommt gerade keine Bestätigungsmail an.',
        mailConfigured: status.configured,
        demoConfirmUrl: `/api/public/newsletter/confirm?token=${doiToken}`,
      }),
      { headers: { 'Content-Type': 'application/json' } },
    );
  } catch (err: any) {
    // Kein PII, keine Schlüssel im Log.
    console.error('[api/public/newsletter/subscribe POST] failed');
    return new Response(JSON.stringify({ error: 'Fehler bei der Anmeldung.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
