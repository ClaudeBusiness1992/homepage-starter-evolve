export const prerender = false;

import type { APIRoute } from 'astro';
import { getDb } from '../../../../lib/db';
import { sha256 } from '../../../../lib/crypto';
import { mailerStatus, sendMail } from '../../../../lib/mailer';

function page(title: string, heading: string, bodyHtml: string, ok: boolean): string {
  // AJS-Palette (olive/espresso/terracotta), kein neues Design.
  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex, follow" />
<title>${title}</title>
<style>
body { background: #221D15; color: #221D15; font-family: system-ui, -apple-system, sans-serif; margin: 0; padding: 1.5rem; display: flex; align-items: center; justify-content: center; min-height: 100vh; box-sizing: border-box; }
.box { background: #FAF6EF; border: 1px solid rgba(65,76,9,0.25); padding: 2.2rem 2rem; border-radius: 16px; max-width: 560px; width: 100%; box-shadow: 0 20px 40px rgba(0,0,0,0.35); text-align: center; }
.badge { display: inline-block; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #414C09; background: rgba(65,76,9,0.12); border-radius: 999px; padding: 0.25rem 0.7rem; margin-bottom: 0.9rem; }
h1 { font-size: 1.4rem; margin: 0 0 0.6rem; color: #414C09; }
p { font-size: 0.92rem; line-height: 1.55; margin: 0 0 0.9rem; }
.example { text-align: left; background: #fff; border: 1px dashed rgba(151,87,42,0.55); border-radius: 12px; padding: 1rem 1.1rem; margin: 1.1rem 0; }
.example h2 { font-size: 0.95rem; margin: 0 0 0.5rem; color: #97572A; }
.example ul { margin: 0; padding-left: 1.1rem; font-size: 0.88rem; line-height: 1.5; }
a.btn { display: inline-block; background: #414C09; color: #fff; text-decoration: none; padding: 0.7rem 1.3rem; border-radius: 8px; font-weight: 700; margin-top: 0.4rem; }
.status { font-size: 2.4rem; margin-bottom: 0.4rem; }
.hint { font-size: 0.8rem; color: #6b6259; }
</style>
</head>
<body>
<div class="box">
<div class="badge">${ok ? 'Newsletter' : 'Link ungültig'}</div>
<div class="status">${ok ? '✓' : '!'}</div>
<h1>${heading}</h1>
${bodyHtml}
<a class="btn" href="/ajs">Zurück zur Seite</a>
</div>
</body>
</html>`;
}

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const token = (url.searchParams.get('token') || '').trim();

  if (!token || token.length > 200) {
    return new Response(
      page(
        'Bestätigungslink ungültig',
        'Dieser Link ist ungültig.',
        '<p>Der Bestätigungslink fehlt oder ist unvollständig. Bitte melde dich erneut für den Newsletter an.</p>',
        false,
      ),
      { status: 400, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
    );
  }

  const tokenHash = sha256(token);
  const db = getDb();
  const subscriber = db
    .prepare('SELECT id, email, status FROM newsletter_subscribers WHERE doi_token_hash = ?')
    .get(tokenHash) as { id: string; email: string; status: string } | undefined;

  if (!subscriber) {
    return new Response(
      page(
        'Bestätigungslink ungültig',
        'Dieser Link ist ungültig oder bereits verwendet.',
        '<p>Der Link passt zu keiner offenen Anmeldung. Mögliche Gründe: Er wurde bereits bestätigt oder die Anmeldung wurde erneut gestartet. Bitte melde dich bei Bedarf erneut an.</p>',
        false,
      ),
      { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
    );
  }

  const now = new Date().toISOString();
  db.prepare(
    `UPDATE newsletter_subscribers SET status = 'confirmed', confirmed_at = ?, doi_token_hash = NULL WHERE id = ?`,
  ).run(now, subscriber.id);

  // Bestätigungsmail nach erfolgreicher Bestätigung (erst jetzt aktiv).
  const status = mailerStatus();
  if (status.configured) {
    try {
      await sendMail({
        to: subscriber.email,
        subject: 'Newsletter-Anmeldung bestätigt',
        text: [
          'Guten Tag,',
          '',
          'deine Newsletter-Anmeldung ist jetzt aktiv. Du erhältst künftig einmal im Monat Neuigkeiten.',
          'Beispielinhalt dieser Bestätigung: Touren-Termine im Mai, neues Sortiment im Juni.',
          '',
          'Abmeldung jederzeit über den Link in jeder Mail möglich.',
        ].join('\n'),
      });
    } catch {
      // Bestätigung bleibt gültig, auch wenn die Willkommensmail scheitert.
    }
  }

  return new Response(
    page(
      'Anmeldung bestätigt',
      'Anmeldung bestätigt.',
      `<p>Deine Anmeldung ist jetzt aktiv. ${
        status.configured
          ? 'Eine Bestätigungsmail ist unterwegs in dein Postfach.'
          : 'Hinweis: Der E-Mail-Versand ist derzeit nicht konfiguriert, daher kommt gerade keine Bestätigungsmail an.'
      }</p>
      <div class="example">
        <h2>Beispielinhalt — keine echten Angebote</h2>
        <ul>
          <li>Beispiel: Touren-Termine im Mai (fiktiv).</li>
          <li>Beispiel: Neues Sortiment im Juni (fiktiv).</li>
          <li>Beispiel: Rezept des Monats (fiktiv).</li>
        </ul>
      </div>
      <p class="hint">So sieht der Ablauf aus: Anmeldung, Link im Postfach, erst nach Bestätigung aktiv.</p>`,
      true,
    ),
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } },
  );
};
