export const prerender = false;

import type { APIRoute } from 'astro';
import { getDb } from '../../../../lib/db';
import { verifyInvoiceToken, sha256, randomToken } from '../../../../lib/crypto';
import { processReviewPhoto } from '../../../../lib/media';

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const token = (formData.get('token') as string || '').trim();
    const ratingRaw = formData.get('rating') as string;
    const authorName = (formData.get('authorName') as string || '').trim();
    const comment = (formData.get('comment') as string || '').trim();
    const photoFile = formData.get('photo') as File | null;

    if (!token) {
      return new Response(JSON.stringify({ error: 'Kein gültiger Rechnungs-Token vorhanden.' }), { status: 400 });
    }

    const verification = verifyInvoiceToken(token);
    if (!verification || !verification.valid) {
      return new Response(JSON.stringify({ error: 'Der Rechnungs-Code ist ungültig oder abgelaufen.' }), { status: 403 });
    }

    const rating = parseInt(ratingRaw, 10);
    if (isNaN(rating) || rating < 1 || rating > 5) {
      return new Response(JSON.stringify({ error: 'Bitte wählen Sie eine Bewertung zwischen 1 und 5 Sternen.' }), { status: 400 });
    }

    if (!authorName) {
      return new Response(JSON.stringify({ error: 'Bitte geben Sie Ihren Namen an.' }), { status: 400 });
    }

    if (!comment || comment.length < 5) {
      return new Response(JSON.stringify({ error: 'Bitte schreiben Sie eine kurze Erfahrung (mindestens 5 Zeichen).' }), { status: 400 });
    }

    const tokenHash = sha256(token);
    const db = getDb();

    // Transaktion: Prüfen und einlösen
    const existingToken = db.prepare('SELECT status, redeemed_at FROM review_tokens WHERE token_hash = ?').get(tokenHash) as { status: string; redeemed_at: string } | undefined;

    if (existingToken && existingToken.status === 'redeemed') {
      return new Response(JSON.stringify({
        error: 'Für diese Rechnung wurde bereits eine Bewertung abgegeben. Vielen Dank!',
        alreadyRedeemed: true
      }), { status: 409 });
    }

    let photoUrl = '';
    if (photoFile && photoFile.size > 0) {
      const buffer = Buffer.from(await photoFile.arrayBuffer());
      const res = await processReviewPhoto(buffer, 'rev-' + randomToken(6));
      photoUrl = res.url;
    }

    const now = new Date().toISOString();
    const reviewId = 'rev-' + randomToken(8);

    // Atomares Update
    const tx = db.transaction(() => {
      // Token als eingelöst markieren (oder anlegen falls Stateless HMAC)
      db.prepare(`
        INSERT INTO review_tokens (token_hash, invoice_ref, status, created_at, redeemed_at)
        VALUES (?, ?, 'redeemed', ?, ?)
        ON CONFLICT(token_hash) DO UPDATE SET status = 'redeemed', redeemed_at = ?
      `).run(tokenHash, verification.invoiceRef, now, now, now);

      // Bewertung anlegen
      db.prepare(`
        INSERT INTO reviews (id, token_hash, invoice_ref, rating, author_name, comment, photo_url, photo_approved, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, 1, 'pending', ?)
      `).run(reviewId, tokenHash, verification.invoiceRef, rating, authorName, comment, photoUrl, now);
    });

    tx();

    return new Response(JSON.stringify({
      success: true,
      message: 'Vielen Dank! Ihre Bewertung wurde erfolgreich übermittelt und wird nach kurzer Prüfung freigeschaltet.'
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('[api/public/reviews/submit POST]', err);
    return new Response(JSON.stringify({ error: err.message || 'Fehler beim Speichern der Bewertung.' }), { status: 500 });
  }
};
