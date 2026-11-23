export const prerender = false;

import type { APIRoute } from 'astro';
import { getDb, syncAutomated24mCycles } from '../../../../lib/db';

export const GET: APIRoute = async () => {
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
