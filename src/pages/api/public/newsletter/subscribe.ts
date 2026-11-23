export const prerender = false;

import type { APIRoute } from 'astro';
import { getDb } from '../../../../lib/db';
import { randomToken, sha256 } from '../../../../lib/crypto';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const email = (body.email || '').trim().toLowerCase();
    const firstName = (body.firstName || '').trim();
    const honeypot = body.website || ''; // Bot-Falle

    if (honeypot) {
      // Stille Erfolgsmeldung für Bots
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!email || !email.includes('@') || !email.includes('.')) {
      return new Response(JSON.stringify({ error: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.' }), { status: 400 });
    }

    const db = getDb();
    const existing = db.prepare('SELECT id, status FROM newsletter_subscribers WHERE email = ?').get(email) as { id: string; status: string } | undefined;

    if (existing && existing.status === 'confirmed') {
      return new Response(JSON.stringify({
        success: true,
        message: 'Sie sind bereits erfolgreich für unseren Newsletter angemeldet.'
      }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const doiToken = randomToken(32);
    const doiTokenHash = sha256(doiToken);
    const unsubToken = randomToken(32);
    const unsubTokenHash = sha256(unsubToken);
    const id = existing?.id || ('sub-' + randomToken(6));
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO newsletter_subscribers (id, email, first_name, status, doi_token_hash, unsubscribe_token_hash, consent_version, created_at)
      VALUES (?, ?, ?, 'pending', ?, ?, 'v1', ?)
      ON CONFLICT(email) DO UPDATE SET
        first_name = ?,
        status = 'pending',
        doi_token_hash = ?,
        created_at = ?
    `).run(id, email, firstName, doiTokenHash, unsubTokenHash, now, firstName, doiTokenHash, now);

    // In Produktion: E-Mail-Versand mit DOI-Link.
    // Für lokale Demo / Vorschau: Automatische Bestätigung oder Ausgabe des Links
    const confirmUrl = `/api/public/newsletter/confirm?token=${doiToken}`;

    return new Response(JSON.stringify({
      success: true,
      message: 'Fast geschafft! Bitte bestätigen Sie Ihre Anmeldung über den Link in Ihrer E-Mail.',
      demoConfirmUrl: confirmUrl,
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('[api/public/newsletter/subscribe POST]', err);
    return new Response(JSON.stringify({ error: err.message || 'Fehler bei der Anmeldung' }), { status: 500 });
  }
};
