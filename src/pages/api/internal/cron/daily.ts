export const prerender = false;

import type { APIRoute } from 'astro';
import { createHash, timingSafeEqual } from 'node:crypto';
import { getDb, syncAutomated24mCycles } from '../../../../lib/db';

export const GET: APIRoute = async ({ request }) => {
  const secret = process.env.CRON_SECRET;
  const supplied = request.headers.get('x-cron-secret');
  if (!secret || !supplied || !timingSafeEqual(
    createHash('sha256').update(secret).digest(),
    createHash('sha256').update(supplied).digest(),
  )) {
    return new Response(null, { status: 401 });
  }
  const db = getDb();
  const rolledOverCount = syncAutomated24mCycles(db);

  return new Response(JSON.stringify({
    success: true,
    timestamp: new Date().toISOString(),
    rolledOverCount,
    message: `${rolledOverCount} fällige Erinnerungen im automatisierten 24-Monate-Zyklus erneuert.`,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = GET;
