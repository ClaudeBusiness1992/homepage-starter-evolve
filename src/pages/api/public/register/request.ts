export const prerender = false;

import type { APIRoute } from 'astro';
import { randomToken, sha256 } from '../../../../lib/crypto';
import { checkRateLimit, mailerStatus, sendMail } from '../../../../lib/mailer';

/**
 * Registrierungs-Anfragen — Token-Ablage bewusst ohne Persistenz:
 * Klartext-Token liegen nur im Bestätigungslink der Mail; serverseitig liegt
 * nur der SHA-256-Hash in einer flüchtigen In-Memory-Map (kein DB-Table,
 * kein neues Auth-System). Einträge laufen nach 24 Stunden ab und werden
 * nach Einlösung gelöscht. Bei Serverneustart verfallen offene Links.
 */
interface Pending {
  tokenHash: string;
  email: string;
  name: string;
  phone: string;
  district: string;
  note: string;
  expiresAt: number;
}

const pending = new Map<string, Pending>();
const TTL_MS = 24 * 60 * 60 * 1000;

export function __pendingForTest(): Map<string, Pending> {
  return pending;
}

function cleanup(): void {
  const now = Date.now();
  for (const [hash, entry] of pending) {
    if (entry.expiresAt <= now) pending.delete(hash);
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (!checkRateLimit(ip)) {
      return new Response(
        JSON.stringify({ error: 'Zu viele Anfragen. Bitte später erneut versuchen.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } },
      );
    }

    let body: any = {};
    try {
      body = await request.json();
    } catch {
      body = {};
    }

    if (body.website) {
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const ts = parseInt(body.ts, 10);
    if (!ts || Date.now() - ts < 2000) {
      return new Response(
        JSON.stringify({ error: 'Formular zu schnell abgesendet. Bitte erneut versuchen.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const phone = String(body.phone || '').trim();
    const district = String(body.district || '').trim();
    const note = String(body.note || '').trim();
    const consent = body.consent === true || body.consent === 'on' || body.consent === 'true';

    if (!name || !email || !phone || !district) {
      return new Response(
        JSON.stringify({ error: 'Bitte fülle alle Pflichtfelder aus.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Gib eine E-Mail-Adresse mit @ ein.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }
    if (!consent) {
      return new Response(
        JSON.stringify({ error: 'Bitte stimme der Datenverarbeitung zu.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }
    if (name.length > 120 || email.length > 200 || phone.length > 60 || district.length > 120 || note.length > 500) {
      return new Response(JSON.stringify({ error: 'Eingaben zu lang.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    cleanup();
    const token = randomToken(32);
    const tokenHash = sha256(token);
    pending.set(tokenHash, {
      tokenHash,
      email,
      name,
      phone,
      district,
      note,
      expiresAt: Date.now() + TTL_MS,
    });

    const origin = new URL(request.url).origin;
    const confirmUrl = `${origin}/api/public/register/confirm?token=${token}`;
    const status = mailerStatus();

    if (status.configured) {
      try {
        // 1) Bestätigungsmail an die neue Adresse (Double-Opt-in).
        await sendMail({
          to: email,
          subject: 'Bitte Registrierung bestätigen',
          text: [
            `Guten Tag ${name},`,
            '',
            'bitte bestätige deine Registrierung über diesen Link:',
            confirmUrl,
            '',
            'Der Link ist 24 Stunden gültig und einmalig verwendbar.',
            'Erst nach Bestätigung prüft AJ deinen Aufnahmeantrag persönlich.',
          ].join('\n'),
          replyTo: email,
        });
        // 2) Registrierungsmail an den Betreiber (falls Empfänger konfiguriert).
        if (status.hasOwnerRecipient && process.env.CONTACT_EMAIL_TO) {
          await sendMail({
            to: process.env.CONTACT_EMAIL_TO,
            subject: `Aufnahmeantrag: ${name}`,
            text: [
              'Neuer Aufnahmeantrag über die Website:',
              '',
              `Name: ${name}`,
              `Stadtteil: ${district}`,
              `Telefon: ${phone}`,
              note ? `Wunsch: ${note}` : 'Wunsch: —',
              '',
              'Hinweis: Adresse noch unbestätigt (Double-Opt-in offen).',
            ].join('\n'),
            replyTo: email,
          });
        }
      } catch {
        pending.delete(tokenHash);
        return new Response(
          JSON.stringify({ error: 'Fehler beim Senden. Bitte später erneut versuchen.' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } },
        );
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: status.configured
          ? 'Fast geschafft! Bitte bestätige deine Registrierung über den Link in deinem Postfach.'
          : 'Aufnahmeantrag gespeichert. Hinweis: Der E-Mail-Versand ist derzeit nicht konfiguriert, daher kommt gerade keine Bestätigungsmail an.',
        mailConfigured: status.configured,
        demoConfirmUrl: `/api/public/register/confirm?token=${token}`,
      }),
      { headers: { 'Content-Type': 'application/json' } },
    );
  } catch {
    console.error('[api/public/register/request POST] failed');
    return new Response(JSON.stringify({ error: 'Fehler bei der Registrierung.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
