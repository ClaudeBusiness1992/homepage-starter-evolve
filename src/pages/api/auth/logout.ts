export const prerender = false;

import type { APIRoute } from 'astro';
import { destroySession } from '../../../lib/auth';

export const POST: APIRoute = async ({ request }) => {
  const cookie = request.headers.get('cookie');
  const clearHeader = destroySession(cookie);

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': clearHeader,
    },
  });
};
