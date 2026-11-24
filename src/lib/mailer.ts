/**
 * mailer.ts — gemeinsamer Resend-Versandweg für AJS (Newsletter + Registrierung).
 *
 * Muster: api/contact.js (serverseitig, Schlüssel nur aus Umgebungsvariable
 * zur Laufzeit, niemals lesen/ausgeben/loggen/committen).
 *
 * - Konfiguration: RESEND_API_KEY + CONTACT_EMAIL_FROM (Absender).
 *   CONTACT_EMAIL_TO ist optional und nur für Betreiber-Benachrichtigungen.
 * - Ohne konfigurierten Schlüssel geht nichts kaputt: Aufrufer erhalten
 *   { configured: false } und zeigen im UI einen klaren Hinweis.
 * - Kein PII-Logging: Fehler enthalten nur Status, keine Inhalte/Schlüssel.
 */

export function isMailerConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_EMAIL_FROM);
}

export function mailerStatus(): { configured: boolean; hasOwnerRecipient: boolean } {
  return {
    configured: isMailerConfigured(),
    hasOwnerRecipient: Boolean(process.env.CONTACT_EMAIL_TO),
  };
}

interface SendArgs {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}

async function sendViaResend(args: SendArgs): Promise<unknown> {
  const apiKey = process.env.RESEND_API_KEY as string;
  const from = process.env.CONTACT_EMAIL_FROM as string;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [args.to],
      subject: args.subject,
      text: args.text,
      ...(args.replyTo ? { reply_to: args.replyTo } : {}),
    }),
  });
  if (!res.ok) {
    // Nur Status melden, keine Inhalte/Schlüssel.
    throw new Error(`Resend failed: ${res.status}`);
  }
  return res.json();
}

/**
 * Versendet eine Mail, wenn konfiguriert. Ohne Konfiguration kein Throw,
 * sondern { sent: false, configured: false } — Aufrufer zeigen UI-Hinweis.
 */
export async function sendMail(args: SendArgs): Promise<{ sent: boolean; configured: boolean }> {
  if (!isMailerConfigured()) return { sent: false, configured: false };
  await sendViaResend(args);
  return { sent: true, configured: true };
}

/** Sehr kleine, flüchtige Ratenbremse pro IP (wie api/contact.js, nur RAM). */
const ipRequests = new Map<string, number[]>();
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60 * 60 * 1000;

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const list = (ipRequests.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  if (list.length >= RATE_LIMIT) return false;
  list.push(now);
  ipRequests.set(ip, list);
  return true;
}
