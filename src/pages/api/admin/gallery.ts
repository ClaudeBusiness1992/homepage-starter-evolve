export const prerender = false;

import type { APIRoute } from 'astro';
import { getDb } from '../../../lib/db';
import { validateSession } from '../../../lib/auth';
import { hasPermission } from '../../../lib/permissions';
import { processGalleryImage, removeMediaFile } from '../../../lib/media';
import { randomToken } from '../../../lib/crypto';

export const GET: APIRoute = async ({ request }) => {
  const cookie = request.headers.get('cookie');
  if (!validateSession(cookie)) {
    return new Response(JSON.stringify({ error: 'Nicht angemeldet' }), { status: 401 });
  }

  const db = getDb();
  const categories = db.prepare('SELECT * FROM gallery_categories ORDER BY sort_order ASC').all();
  const items = db.prepare('SELECT * FROM gallery_items ORDER BY sort_order ASC, created_at DESC').all();

  return new Response(JSON.stringify({ categories, items }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async ({ request }) => {
  const cookie = request.headers.get('cookie');
  if (!validateSession(cookie)) {
    return new Response(JSON.stringify({ error: 'Nicht angemeldet' }), { status: 401 });
  }
  if (!hasPermission('canEditGallery')) {
    return new Response(JSON.stringify({ error: 'Keine Berechtigung' }), { status: 403 });
  }

  const contentType = request.headers.get('content-type') || '';
  const db = getDb();

  try {
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const title = (formData.get('title') as string || '').trim();
      const altText = (formData.get('altText') as string || title || '').trim();
      const categoryId = (formData.get('categoryId') as string || '').trim() || null;

      const file = formData.get('file') as File | null;
      if (!file || file.size === 0) {
        return new Response(JSON.stringify({ error: 'Keine Datei ausgewählt' }), { status: 400 });
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const idPrefix = 'gal-' + randomToken(4);
      const res = await processGalleryImage(buffer, idPrefix);

      const id = 'gi-' + randomToken(6);
      const maxOrder = db.prepare('SELECT COALESCE(MAX(sort_order), 0) as max_order FROM gallery_items').get() as { max_order: number };
      const sortOrder = maxOrder.max_order + 1;
      const now = new Date().toISOString();

      db.prepare(`
        INSERT INTO gallery_items (id, category_id, title, alt_text, image_url, width, height, blur_data, sort_order, is_published, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
      `).run(id, categoryId, title, altText, res.url, res.width || 1200, res.height || 900, res.blurData || '', sortOrder, now);

      return new Response(JSON.stringify({ success: true, id, url: res.url }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Ungültiger Content-Type' }), { status: 400 });
  } catch (err: any) {
    console.error('[api/admin/gallery POST]', err);
    return new Response(JSON.stringify({ error: err.message || 'Upload fehlgeschlagen' }), { status: 500 });
  }
};

export const PUT: APIRoute = async ({ request }) => {
  const cookie = request.headers.get('cookie');
  if (!validateSession(cookie)) {
    return new Response(JSON.stringify({ error: 'Nicht angemeldet' }), { status: 401 });
  }
  if (!hasPermission('canEditGallery')) {
    return new Response(JSON.stringify({ error: 'Keine Berechtigung' }), { status: 403 });
  }

  try {
    const body = await request.json();
    const { id, title, altText, categoryId, isPublished } = body;
    if (!id) {
      return new Response(JSON.stringify({ error: 'ID erforderlich' }), { status: 400 });
    }

    const db = getDb();
    db.prepare(`
      UPDATE gallery_items
      SET title = ?, alt_text = ?, category_id = ?, is_published = ?
      WHERE id = ?
    `).run(title || '', altText || '', categoryId || null, isPublished ?? 1, id);

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
  if (!hasPermission('canEditGallery')) {
    return new Response(JSON.stringify({ error: 'Keine Berechtigung' }), { status: 403 });
  }

  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) {
    return new Response(JSON.stringify({ error: 'ID erforderlich' }), { status: 400 });
  }

  const db = getDb();
  const existing = db.prepare('SELECT image_url FROM gallery_items WHERE id = ?').get(id) as { image_url: string } | undefined;
  if (existing?.image_url) {
    removeMediaFile(existing.image_url);
  }

  db.prepare('DELETE FROM gallery_items WHERE id = ?').run(id);

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
