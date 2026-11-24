export const prerender = false;

import type { APIRoute } from 'astro';
import QRCode from 'qrcode';
import { validateSession } from '../../../../lib/auth';
import { hasPermission } from '../../../../lib/permissions';
import { generateInvoiceToken, sha256 } from '../../../../lib/crypto';
import { getDb } from '../../../../lib/db';

export const POST: APIRoute = async ({ request, url }) => {
  const cookie = request.headers.get('cookie');
  if (!validateSession(cookie)) {
    return new Response(JSON.stringify({ error: 'Nicht angemeldet' }), { status: 401 });
  }
  if (!hasPermission('canManageReviews')) {
    return new Response(JSON.stringify({ error: 'Keine Berechtigung' }), { status: 403 });
  }

  try {
    const body = await request.json();
    const invoiceRef = (body.invoiceRef || '').trim().toUpperCase();
    if (!invoiceRef) {
      return new Response(JSON.stringify({ error: 'Rechnungsnummer ist erforderlich' }), { status: 400 });
    }

    const token = generateInvoiceToken(invoiceRef);
    const tokenHash = sha256(token);

    // In DB registrieren
    const db = getDb();
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO review_tokens (token_hash, invoice_ref, status, created_at)
      VALUES (?, ?, 'issued', ?)
      ON CONFLICT(token_hash) DO NOTHING
    `).run(tokenHash, invoiceRef, now);

    // QR Code generieren
    // Basis-URL ermitteln (entweder aus Origin oder Host)
    const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || '100.78.121.108:4401';
    const protocol = host.includes('localhost') || host.includes('100.78.121.108') ? 'http' : 'https';
    const targetUrl = `${protocol}://${host}/bewertung?t=${token}`;

    const qrSvg = await QRCode.toString(targetUrl, {
      type: 'svg',
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    });

    const qrDataUrl = await QRCode.toDataURL(targetUrl, {
      margin: 2,
      width: 400,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    });

    return new Response(JSON.stringify({
      success: true,
      invoiceRef,
      token,
      targetUrl,
      qrSvg,
      qrDataUrl,
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('[api/admin/reviews/qr POST]', err);
    return new Response(JSON.stringify({ error: err.message || 'QR-Erstellung fehlgeschlagen' }), { status: 500 });
  }
};
