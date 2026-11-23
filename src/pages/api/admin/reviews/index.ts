export const prerender = false;

import type { APIRoute } from 'astro';
import { getDb } from '../../../../lib/db';
import { validateSession } from '../../../../lib/auth';
import { hasPermission } from '../../../../lib/permissions';
import { removeMediaFile } from '../../../../lib/media';

export const GET: APIRoute = async ({ request }) => {
  const cookie = request.headers.get('cookie');
  if (!validateSession(cookie)) {
    return new Response(JSON.stringify({ error: 'Nicht angemeldet' }), { status: 401 });
  }

  const db = getDb();
  const reviews = db.prepare(`
    SELECT * FROM reviews ORDER BY created_at DESC
  `).all();

  const pendingCount = db.prepare(`SELECT COUNT(*) as count FROM reviews WHERE status = 'pending'`).get() as { count: number };
  const approvedCount = db.prepare(`SELECT COUNT(*) as count FROM reviews WHERE status = 'approved'`).get() as { count: number };

  return new Response(JSON.stringify({
    reviews,
    counts: {
      pending: pendingCount.count,
      approved: approvedCount.count,
      total: reviews.length,
    },
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const PATCH: APIRoute = async ({ request }) => {
  const cookie = request.headers.get('cookie');
  if (!validateSession(cookie)) {
    return new Response(JSON.stringify({ error: 'Nicht angemeldet' }), { status: 401 });
  }
  if (!hasPermission('canManageReviews')) {
    return new Response(JSON.stringify({ error: 'Keine Berechtigung' }), { status: 403 });
  }

  try {
    const body = await request.json();
    const { id, action } = body;
    if (!id || !action) {
      return new Response(JSON.stringify({ error: 'ID und Aktion erforderlich' }), { status: 400 });
    }

    const db = getDb();
    const now = new Date().toISOString();

    if (action === 'approve') {
      db.prepare(`
        UPDATE reviews
        SET status = 'approved', photo_approved = 1, approved_at = ?
        WHERE id = ?
      `).run(now, id);
    } else if (action === 'approve_without_photo') {
      db.prepare(`
        UPDATE reviews
        SET status = 'approved', photo_approved = 0, approved_at = ?
        WHERE id = ?
      `).run(now, id);
    } else if (action === 'archive') {
      db.prepare(`
        UPDATE reviews
        SET status = 'archived'
        WHERE id = ?
      `).run(id);
    } else {
      return new Response(JSON.stringify({ error: 'Unbekannte Aktion' }), { status: 400 });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  const cookie = request.headers.get('cookie');
  if (!validateSession(cookie)) {
    return new Response(JSON.stringify({ error: 'Nicht angemeldet' }), { status: 401 });
  }
  if (!hasPermission('canManageReviews')) {
    return new Response(JSON.stringify({ error: 'Keine Berechtigung' }), { status: 403 });
  }

  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) {
    return new Response(JSON.stringify({ error: 'ID erforderlich' }), { status: 400 });
  }

  const db = getDb();
  const existing = db.prepare('SELECT photo_url FROM reviews WHERE id = ?').get(id) as { photo_url: string } | undefined;
  if (existing?.photo_url) {
    removeMediaFile(existing.photo_url);
  }

  db.prepare('DELETE FROM reviews WHERE id = ?').run(id);

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
