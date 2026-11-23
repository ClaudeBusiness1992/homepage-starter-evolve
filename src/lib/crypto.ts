import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { SITE_CONFIG_FILE } from './paths.ts';

function getSecretKey(): string {
  try {
    if (fs.existsSync(SITE_CONFIG_FILE)) {
      const cfg = JSON.parse(fs.readFileSync(SITE_CONFIG_FILE, 'utf-8'));
      if (cfg.qrSecret) return cfg.qrSecret;
    }
  } catch {}
  return 'default-instance-qr-secret-2026-pixelcode';
}

export function sha256(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex');
}

export function randomToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString('hex');
}

/**
 * Erzeugt einen signierten Rechnungs-Token für den QR-Code:
 * Format: base64url(invoiceRef + "." + yyyymm) + "." + 16_bytes_hmac_hex
 */
export function generateInvoiceToken(invoiceRef: string, yyyymm?: string): string {
  const cleanRef = invoiceRef.trim().toUpperCase();
  const dateStr = yyyymm || new Date().toISOString().slice(0, 7).replace('-', '');
  const payload = `${cleanRef}.${dateStr}`;
  const payloadB64 = Buffer.from(payload, 'utf-8').toString('base64url');
  
  const hmac = crypto.createHmac('sha256', getSecretKey());
  hmac.update(payload);
  const signature = hmac.digest('hex').slice(0, 32); // 16 bytes hex

  return `${payloadB64}.${signature}`;
}

/**
 * Validiert einen Rechnungs-Token und gibt die Rechnungsdaten zurück,
 * oder null, wenn die Signatur ungültig ist.
 */
export function verifyInvoiceToken(token: string): { valid: boolean; invoiceRef: string; yyyymm: string } | null {
  if (!token || typeof token !== 'string') return null;
  const parts = token.trim().split('.');
  if (parts.length !== 2) return null;

  const [payloadB64, signature] = parts;
  try {
    const payload = Buffer.from(payloadB64, 'base64url').toString('utf-8');
    const pParts = payload.split('.');
    if (pParts.length < 2) return null;
    const invoiceRef = pParts.slice(0, -1).join('.');
    const yyyymm = pParts[pParts.length - 1];

    const hmac = crypto.createHmac('sha256', getSecretKey());
    hmac.update(payload);
    const expectedSig = hmac.digest('hex').slice(0, 32);

    if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
      return { valid: true, invoiceRef, yyyymm };
    }
  } catch (err) {
    return null;
  }
  return null;
}
