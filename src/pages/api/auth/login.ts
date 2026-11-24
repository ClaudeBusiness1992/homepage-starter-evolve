export const prerender = false;

import type { APIRoute } from 'astro';
import { checkRateLimit, recordFailedLogin, resetLoginAttempts, verifyAdminPin, createAdminSession } from '../../../lib/auth';

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const ip = clientAddress || request.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';

  const rate = checkRateLimit(ip);
  if (!rate.allowed) {
    return new Response(JSON.stringify({
      error: 'Zu viele Fehlversuche. Bitte warten Sie 15 Minuten vor dem nächsten Versuch.'
    }), { status: 429 });
  }

  try {
    const body = await request.json();
    const pin = (body.pin || '').trim();

    if (!pin) {
      return new Response(JSON.stringify({ error: 'Bitte geben Sie Ihre PIN ein.' }), { status: 400 });
    }

    if (!verifyAdminPin(pin)) {
      recordFailedLogin(ip);
      const updatedRate = checkRateLimit(ip);
      return new Response(JSON.stringify({
        error: `Ungültige PIN. Noch ${updatedRate.remainingAttempts} Versuche verbleibend.`
      }), { status: 401 });
    }

    resetLoginAttempts(ip);
    const session = createAdminSession('kunden-admin');

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': session.cookieHeader,
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Login-Fehler' }), { status: 500 });
  }
};
