export const prerender = false;

import type { APIRoute } from 'astro';
import { getDb } from '../../../../lib/db';
import { validateSession } from '../../../../lib/auth';
import { hasPermission } from '../../../../lib/permissions';

export const GET: APIRoute = async ({ request }) => {
  const cookie = request.headers.get('cookie');
  if (!validateSession(cookie)) {
    return new Response('Nicht angemeldet', { status: 401 });
  }
  if (!hasPermission('canManageNewsletter')) {
    return new Response('Keine Berechtigung', { status: 403 });
  }

  const db = getDb();
  const subscribers = db.prepare(`
    SELECT email, first_name, status, confirmed_at, created_at
    FROM newsletter_subscribers
    WHERE status = 'confirmed'
    ORDER BY confirmed_at DESC
  `).all() as Array<{ email: string; first_name: string; status: string; confirmed_at: string; created_at: string }>;

  // CSV mit UTF-8 BOM für Excel
  let csv = '\uFEFF"E-Mail";"Vorname";"Status";"Bestätigt am";"Angemeldet am"\r\n';
  for (const s of subscribers) {
    const email = (s.email || '').replace(/"/g, '""');
    const name = (s.first_name || '').replace(/"/g, '""');
    const confirmed = s.confirmed_at || '';
    const created = s.created_at || '';
    csv += `"${email}";"${name}";"${s.status}";"${confirmed}";"${created}"\r\n`;
  }

  const filename = `newsletter-abonnenten-${new Date().toISOString().slice(0, 10)}.csv`;

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
};
