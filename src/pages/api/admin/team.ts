export const prerender = false;

import type { APIRoute } from 'astro';
import { getDb } from '../../../lib/db';
import { validateSession } from '../../../lib/auth';
import { hasPermission } from '../../../lib/permissions';
import { processTeamPhoto, removeMediaFile } from '../../../lib/media';
import { randomToken } from '../../../lib/crypto';

export const GET: APIRoute = async ({ request }) => {
  const cookie = request.headers.get('cookie');
  if (!validateSession(cookie)) {
    return new Response(JSON.stringify({ error: 'Nicht angemeldet' }), { status: 401 });
  }

  const db = getDb();
  const members = db.prepare('SELECT * FROM team_members ORDER BY sort_order ASC, id ASC').all();
  return new Response(JSON.stringify({ members }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async ({ request }) => {
  const cookie = request.headers.get('cookie');
  if (!validateSession(cookie)) {
    return new Response(JSON.stringify({ error: 'Nicht angemeldet' }), { status: 401 });
  }
  if (!hasPermission('canEditTeam')) {
    return new Response(JSON.stringify({ error: 'Keine Berechtigung für Team-Verwaltung' }), { status: 403 });
  }

  const contentType = request.headers.get('content-type') || '';
  const db = getDb();

  try {
    let name = '';
    let role = '';
    let bio = '';
    let photoUrl = '';
    let photoBlur = '';
    let focalY = 35;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      name = (formData.get('name') as string || '').trim();
      role = (formData.get('role') as string || '').trim();
      bio = (formData.get('bio') as string || '').trim();
      const focalRaw = formData.get('focalY');
      if (focalRaw) focalY = parseInt(focalRaw as string, 10) || 35;

      const file = formData.get('photo') as File | null;
      if (file && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const idPrefix = 'team-' + randomToken(4);
        const res = await processTeamPhoto(buffer, idPrefix, focalY);
        photoUrl = res.url;
        photoBlur = res.blurData || '';
      }
    } else {
      const body = await request.json();
      name = (body.name || '').trim();
      role = (body.role || '').trim();
      bio = (body.bio || '').trim();
      photoUrl = body.photoUrl || '';
      focalY = body.focalY || 35;
    }

    if (!name || !role) {
      return new Response(JSON.stringify({ error: 'Name und Position sind Pflichtfelder' }), { status: 400 });
    }

    const id = 'tm-' + randomToken(6);
    const maxOrder = db.prepare('SELECT COALESCE(MAX(sort_order), 0) as max_order FROM team_members').get() as { max_order: number };
    const sortOrder = maxOrder.max_order + 1;
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO team_members (id, name, role, bio, photo_url, photo_blur_data, photo_focal_y, sort_order, is_published, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
    `).run(id, name, role, bio, photoUrl, photoBlur, focalY, sortOrder, now);

    return new Response(JSON.stringify({ success: true, id }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('[api/admin/team POST]', err);
    return new Response(JSON.stringify({ error: err.message || 'Serverfehler beim Speichern' }), { status: 500 });
  }
};

export const PUT: APIRoute = async ({ request }) => {
  const cookie = request.headers.get('cookie');
  if (!validateSession(cookie)) {
    return new Response(JSON.stringify({ error: 'Nicht angemeldet' }), { status: 401 });
  }
  if (!hasPermission('canEditTeam')) {
    return new Response(JSON.stringify({ error: 'Keine Berechtigung' }), { status: 403 });
  }

  const contentType = request.headers.get('content-type') || '';
  const db = getDb();

  try {
    let id = '';
    let name = '';
    let role = '';
    let bio = '';
    let photoUrl = '';
    let photoBlur = '';
    let focalY = 35;
    let isPublished = 1;
    let hasNewPhoto = false;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      id = (formData.get('id') as string || '').trim();
      name = (formData.get('name') as string || '').trim();
      role = (formData.get('role') as string || '').trim();
      bio = (formData.get('bio') as string || '').trim();
      const focalRaw = formData.get('focalY');
      if (focalRaw) focalY = parseInt(focalRaw as string, 10) || 35;
      if (formData.has('is_published')) {
        isPublished = formData.get('is_published') === '1' ? 1 : 0;
      }

      const file = formData.get('photo') as File | null;
      if (file && file.size > 0) {
        hasNewPhoto = true;
        const buffer = Buffer.from(await file.arrayBuffer());
        const idPrefix = 'team-' + randomToken(4);
        const res = await processTeamPhoto(buffer, idPrefix, focalY);
        photoUrl = res.url;
        photoBlur = res.blurData || '';
      }
    } else {
      const body = await request.json();
      id = body.id;
      name = (body.name || '').trim();
      role = (body.role || '').trim();
      bio = (body.bio || '').trim();
      photoUrl = body.photoUrl;
      focalY = body.focalY || 35;
      isPublished = body.is_published ?? 1;
    }

    if (!id || !name || !role) {
      return new Response(JSON.stringify({ error: 'ID, Name und Position erforderlich' }), { status: 400 });
    }

    const existing = db.prepare('SELECT photo_url FROM team_members WHERE id = ?').get(id) as { photo_url: string } | undefined;
    if (!existing) {
      return new Response(JSON.stringify({ error: 'Mitglied nicht gefunden' }), { status: 404 });
    }

    const now = new Date().toISOString();

    if (hasNewPhoto) {
      removeMediaFile(existing.photo_url);
      db.prepare(`
        UPDATE team_members
        SET name = ?, role = ?, bio = ?, photo_url = ?, photo_blur_data = ?, photo_focal_y = ?, is_published = ?, updated_at = ?
        WHERE id = ?
      `).run(name, role, bio, photoUrl, photoBlur, focalY, isPublished, now, id);
    } else {
      db.prepare(`
        UPDATE team_members
        SET name = ?, role = ?, bio = ?, photo_focal_y = ?, is_published = ?, updated_at = ?
        WHERE id = ?
      `).run(name, role, bio, focalY, isPublished, now, id);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('[api/admin/team PUT]', err);
    return new Response(JSON.stringify({ error: err.message || 'Serverfehler' }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  const cookie = request.headers.get('cookie');
  if (!validateSession(cookie)) {
    return new Response(JSON.stringify({ error: 'Nicht angemeldet' }), { status: 401 });
  }
  if (!hasPermission('canEditTeam')) {
    return new Response(JSON.stringify({ error: 'Keine Berechtigung' }), { status: 403 });
  }

  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) {
    return new Response(JSON.stringify({ error: 'ID erforderlich' }), { status: 400 });
  }

  const db = getDb();
  const existing = db.prepare('SELECT photo_url FROM team_members WHERE id = ?').get(id) as { photo_url: string } | undefined;
  if (existing?.photo_url) {
    removeMediaFile(existing.photo_url);
  }

  db.prepare('DELETE FROM team_members WHERE id = ?').run(id);

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
