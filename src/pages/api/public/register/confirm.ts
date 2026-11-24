export const prerender = false;

import type { APIRoute } from 'astro';
import { sha256 } from '../../../../lib/crypto';
import { mailerStatus, sendMail } from '../../../../lib/mailer';
import { __pendingForTest } from './request';

function page(title: string, heading: string, bodyHtml: string, ok: boolean): string {
  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex, follow" />
<title>${title}</title>
<style>
body { background: #221D15; font-family: system-ui, -apple-system, sans-serif; margin: 0; padding: 1.5rem; display: flex; align-items: center; justify-content: center; min-height: 100vh; box-sizing: border-box; }
.box { background: #FAF6EF; border: 1px solid rgba(65,76,9,0.25); padding: 2.2rem 2rem; border-radius: 16px; max-width: 560px; width: 100%; box-shadow: 0 20px 40px rgba(0,0,0,0.35); text-align: center; }
.badge { display: inline-block; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #414C09; background: rgba(65,76,9,0.12); border-radius: 999px; padding: 0.25rem 0.7rem; margin-bottom: 0.9rem; }
h1 { font-size: 1.4rem; margin: 0 0 0.6rem; color: #414C09; }
p { font-size: 0.92rem; line-height: 1.55; margin: 0 0 0.9rem; color: #221D15; }
a.btn { display: inline-block; background: #414C09; color: #fff; text-decoration: none; padding: 0.7rem 1.3rem; border-radius: 8px; font-weight: 700; margin-top: 0.4rem; }
.status { font-size: 2.4rem; margin-bottom: 0.4rem; }
.hint { font-size: 0.8rem; color: #6b6259; }
</style>
</head>
<body>
<div class="box">
<div class="badge">${ok ? 'Registrierung' : 'Link ungültig'}</div>
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
        '<p>Der Bestätigungslink fehlt oder ist unvollständig. Bitte starte die Registrierung erneut.</p>',
        false,
      ),
      { status: 400, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
    );
  }

  const tokenHash = sha256(token);
  const entry = __pendingForTest().get(tokenHash);
  if (!entry || entry.expiresAt <= Date.now()) {
    if (entry) __pendingForTest().delete(tokenHash);
    return new Response(
      page(
        'Bestätigungslink ungültig',
        'Dieser Link ist ungültig oder abgelaufen.',
        '<p>Der Link passt zu keinem offenen Aufnahmeantrag. Mögliche Gründe: Er wurde bereits verwendet oder die 24 Stunden sind um. Bitte starte die Registrierung bei Bedarf erneut.</p>',
        false,
      ),
      { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
    );
  }

  __pendingForTest().delete(tokenHash);
  const status = mailerStatus();
  if (status.configured) {
    try {
      await sendMail({
        to: entry.email,
        subject: 'Aufnahmeantrag erhalten',
        text: [
          `Guten Tag ${entry.name},`,
          '',
          'deine E-Mail-Adresse ist bestätigt. AJ prüft deinen Aufnahmeantrag persönlich und meldet sich innerhalb von 24 Stunden.',
          'Hinweis: Dies ist eine Bestätigungsmail, noch keine Freischaltung eines Kundenkontos.',
        ].join('\n'),
      });
    } catch {
      // Bestätigung bleibt gültig, auch wenn die Mail scheitert.
    }
  }

  return new Response(
    page(
      'Registrierung bestätigt',
      'E-Mail-Adresse bestätigt.',
      `<p>Danke! Deine Adresse ist bestätigt. AJ prüft deinen Aufnahmeantrag persönlich und meldet sich innerhalb von 24 Stunden. ${
        status.configured
          ? 'Eine Bestätigungsmail ist unterwegs in dein Postfach.'
          : 'Hinweis: Der E-Mail-Versand ist derzeit nicht konfiguriert, daher kommt gerade keine Bestätigungsmail an.'
      }</p>
      <p class="hint">Platzhalter-Hinweis: Ein Kundenkonto entsteht erst nach manueller Freischaltung. Diese Seite schaltet nichts frei.</p>`,
      true,
    ),
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } },
  );
};
