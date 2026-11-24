export const prerender = false;

import type { APIRoute } from 'astro';
import { getDb } from '../../../lib/db';
import { validateSession } from '../../../lib/auth';
import { hasPermission } from '../../../lib/permissions';

export const GET: APIRoute = async ({ request }) => {
  const cookie = request.headers.get('cookie');
  if (!validateSession(cookie)) {
    return new Response(JSON.stringify({ error: 'Nicht angemeldet' }), { status: 401 });
  }

  const db = getDb();
  const links = db.prepare('SELECT * FROM social_links ORDER BY sort_order ASC').all();

  return new Response(JSON.stringify({ links }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const PUT: APIRoute = async ({ request }) => {
  const cookie = request.headers.get('cookie');
  if (!validateSession(cookie)) {
    return new Response(JSON.stringify({ error: 'Nicht angemeldet' }), { status: 401 });
  }
  if (!hasPermission('canEditSocial')) {
    return new Response(JSON.stringify({ error: 'Keine Berechtigung' }), { status: 403 });
  }

  try {
    const body = await request.json();
    const links = body.links as Array<{ platform: string; url: string; is_enabled: number }>;

    if (!Array.isArray(links)) {
      return new Response(JSON.stringify({ error: 'Ungültiges Format' }), { status: 400 });
    }

    const db = getDb();
    const updateStmt = db.prepare(`
      UPDATE social_links
      SET url = ?, is_enabled = ?
      WHERE platform = ?
    `);

    const tx = db.transaction(() => {
      for (const item of links) {
        updateStmt.run(item.url || '', item.is_enabled ? 1 : 0, item.platform);
      }
    });

    tx();

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
