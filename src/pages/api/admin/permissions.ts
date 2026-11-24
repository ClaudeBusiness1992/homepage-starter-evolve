export const prerender = false;

import type { APIRoute } from 'astro';
import { getPermissions, savePermissions, type PermissionsConfig } from '../../../lib/permissions';
import { validateSession } from '../../../lib/auth';

export const GET: APIRoute = async ({ request }) => {
  const cookie = request.headers.get('cookie');
  if (!validateSession(cookie)) {
    return new Response(JSON.stringify({ error: 'Nicht angemeldet' }), { status: 401 });
  }

  const config = getPermissions();
  return new Response(JSON.stringify({ config }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async ({ request }) => {
  const cookie = request.headers.get('cookie');
  if (!validateSession(cookie)) {
    return new Response(JSON.stringify({ error: 'Nicht angemeldet' }), { status: 401 });
  }

  try {
    const body = await request.json();
    const config = body.config as PermissionsConfig;

    if (!config || !config.permissions || !config.sections) {
      return new Response(JSON.stringify({ error: 'Ungültige Konfiguration' }), { status: 400 });
    }

    savePermissions(config);

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
