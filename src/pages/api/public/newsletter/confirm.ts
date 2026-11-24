export const prerender = false;

import type { APIRoute } from 'astro';
import { getDb } from '../../../../lib/db';
import { sha256 } from '../../../../lib/crypto';

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const token = url.searchParams.get('token');

  if (!token) {
    return new Response('Ungültiger Bestätigungslink', { status: 400 });
  }

  const tokenHash = sha256(token);
  const db = getDb();
  const subscriber = db.prepare('SELECT id, email, status FROM newsletter_subscribers WHERE doi_token_hash = ?').get(tokenHash) as { id: string; email: string; status: string } | undefined;

  if (!subscriber) {
    return new Response('Der Bestätigungslink ist ungültig oder abgelaufen.', { status: 404 });
  }

  const now = new Date().toISOString();
  db.prepare(`
    UPDATE newsletter_subscribers
    SET status = 'confirmed', confirmed_at = ?, doi_token_hash = NULL
    WHERE id = ?
  `).run(now, subscriber.id);

  // Weiterleitung auf eine freundliche Bestätigungsansicht
  return new Response(`
    <!DOCTYPE html>
    <html lang="de">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Anmeldung bestätigt</title>
      <style>
        body { background: #090a0f; color: #f8fafc; font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 1.5rem; text-align: center; }
        .box { background: #12131a; border: 1px solid rgba(255,255,255,0.08); padding: 2.5rem 2rem; border-radius: 1.25rem; max-width: 460px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
        h1 { font-size: 1.5rem; margin-bottom: 0.75rem; color: #ffffff; }
        p { color: #94a3b8; font-size: 1rem; line-height: 1.5; margin-bottom: 1.5rem; }
        a { display: inline-block; background: #6366f1; color: #ffffff; text-decoration: none; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="box">
        <div style="font-size: 3rem; margin-bottom: 1rem;">✅</div>
        <h1>Anmeldung bestätigt!</h1>
        <p>Vielen Dank! Ihre E-Mail-Adresse (${subscriber.email}) wurde erfolgreich für unseren Newsletter freigeschaltet.</p>
        <a href="/">Zurück zur Website</a>
      </div>
    </body>
    </html>
  `, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
};
