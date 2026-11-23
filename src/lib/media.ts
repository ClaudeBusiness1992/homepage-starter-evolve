import sharp from 'sharp';
import path from 'node:path';
import fs from 'node:fs';
import { PUBLIC_UPLOADS_DIR } from './paths.ts';

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

export interface ProcessedImageResult {
  url: string;
  blurData?: string;
  width?: number;
  height?: number;
}

/**
 * Verarbeitet ein Team-Foto mit striktem 4:5 Zuschnitt,
 * EXIF-Bereinigung und WebP-Generierung.
 */
export async function processTeamPhoto(
  buffer: Buffer,
  filenameBase: string,
  focalY = 35
): Promise<ProcessedImageResult> {
  const targetDir = path.join(PUBLIC_UPLOADS_DIR, 'team');
  ensureDir(targetDir);

  const filename = `${filenameBase}-4x5.webp`;
  const filePath = path.join(targetDir, filename);

  // 1. EXIF bereinigen, rotieren und auf 4:5 (800x1000) zuschneiden
  const img = sharp(buffer).rotate(); // auto-orient

  const metadata = await img.metadata();
  const width = metadata.width || 800;
  const height = metadata.height || 1000;

  // Smart crop oder focal position
  const targetWidth = 800;
  const targetHeight = 1000;

  await img
    .resize(targetWidth, targetHeight, {
      fit: 'cover',
      position: sharp.strategy.attention,
    })
    .webp({ quality: 84 })
    .toFile(filePath);

  // 2. Base64 Blur-LQIP (20px)
  const blurBuffer = await sharp(buffer)
    .resize(20, 25, { fit: 'cover' })
    .webp({ quality: 20 })
    .toBuffer();
  const blurData = `data:image/webp;base64,${blurBuffer.toString('base64')}`;

  return {
    url: `/uploads/team/${filename}`,
    blurData,
    width: targetWidth,
    height: targetHeight,
  };
}

/**
 * Verarbeitet ein Galerie-Bild mit responsiver Skalierung und EXIF-Bereinigung.
 */
export async function processGalleryImage(
  buffer: Buffer,
  filenameBase: string
): Promise<ProcessedImageResult> {
  const targetDir = path.join(PUBLIC_UPLOADS_DIR, 'gallery');
  ensureDir(targetDir);

  const filename = `${filenameBase}-opt.webp`;
  const filePath = path.join(targetDir, filename);

  const img = sharp(buffer).rotate();
  const meta = await img.metadata();

  // Max 1600px Breite/Höhe
  const res = await img
    .resize({
      width: 1600,
      height: 1600,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: 82 })
    .toFile(filePath);

  const blurBuffer = await sharp(buffer)
    .resize(24, 18, { fit: 'inside' })
    .webp({ quality: 20 })
    .toBuffer();
  const blurData = `data:image/webp;base64,${blurBuffer.toString('base64')}`;

  return {
    url: `/uploads/gallery/${filename}`,
    blurData,
    width: res.width,
    height: res.height,
  };
}

/**
 * Verarbeitet ein Kundenfoto für Bewertungen (max. 1200px, EXIF-Strip)
 */
export async function processReviewPhoto(
  buffer: Buffer,
  filenameBase: string
): Promise<ProcessedImageResult> {
  const targetDir = path.join(PUBLIC_UPLOADS_DIR, 'reviews');
  ensureDir(targetDir);

  const filename = `${filenameBase}-rev.webp`;
  const filePath = path.join(targetDir, filename);

  await sharp(buffer)
    .rotate()
    .resize(1200, 1200, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: 80 })
    .toFile(filePath);

  return {
    url: `/uploads/reviews/${filename}`,
  };
}

/**
 * Entfernt alte Bilddateien sicher aus public/uploads
 */
export function removeMediaFile(fileUrl?: string): void {
  if (!fileUrl || !fileUrl.startsWith('/uploads/')) return;
  const relative = fileUrl.replace(/^\/uploads\//, '');
  const absPath = path.join(PUBLIC_UPLOADS_DIR, relative);
  try {
    if (fs.existsSync(absPath)) {
      fs.unlinkSync(absPath);
    }
  } catch (err) {
    console.error('[media] Fehler beim Löschen der Datei:', absPath, err);
  }
}
