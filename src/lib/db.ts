import Database from 'better-sqlite3';
import path from 'node:path';
import fs from 'node:fs';
import { DB_PATH, RUNTIME_DIR } from './paths.ts';

let dbInstance: Database.Database | null = null;

export function getDb(): Database.Database {
  if (dbInstance) return dbInstance;

  fs.mkdirSync(RUNTIME_DIR, { recursive: true });
  dbInstance = new Database(DB_PATH);
  dbInstance.pragma('journal_mode = WAL');
  dbInstance.pragma('foreign_keys = ON');

  initSchema(dbInstance);
  return dbInstance;
}

function initSchema(db: Database.Database) {
  db.exec(`
    -- Team-Mitglieder
    CREATE TABLE IF NOT EXISTS team_members (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      bio TEXT DEFAULT '',
      photo_url TEXT DEFAULT '',
      photo_blur_data TEXT DEFAULT '',
      photo_focal_y INTEGER DEFAULT 35,
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_published INTEGER NOT NULL DEFAULT 1,
      updated_at TEXT NOT NULL
    );

    -- Galerie-Kategorien
    CREATE TABLE IF NOT EXISTS gallery_categories (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    -- Galerie-Bilder
    CREATE TABLE IF NOT EXISTS gallery_items (
      id TEXT PRIMARY KEY,
      category_id TEXT REFERENCES gallery_categories(id) ON DELETE SET NULL,
      title TEXT NOT NULL DEFAULT '',
      alt_text TEXT NOT NULL DEFAULT '',
      image_url TEXT NOT NULL,
      width INTEGER NOT NULL DEFAULT 1200,
      height INTEGER NOT NULL DEFAULT 900,
      blur_data TEXT DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_published INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL
    );

    -- Rechnungs-Tokens
    CREATE TABLE IF NOT EXISTS review_tokens (
      token_hash TEXT PRIMARY KEY,
      invoice_ref TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'issued', -- issued | redeemed | revoked
      created_at TEXT NOT NULL,
      redeemed_at TEXT
    );

    -- Bewertungen
    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      token_hash TEXT UNIQUE NOT NULL REFERENCES review_tokens(token_hash),
      invoice_ref TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
      author_name TEXT NOT NULL,
      comment TEXT NOT NULL,
      photo_url TEXT DEFAULT '',
      photo_approved INTEGER NOT NULL DEFAULT 1,
      status TEXT NOT NULL DEFAULT 'pending', -- pending | approved | archived
      created_at TEXT NOT NULL,
      approved_at TEXT
    );

    -- Social-Links
    CREATE TABLE IF NOT EXISTS social_links (
      platform TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      url TEXT NOT NULL DEFAULT '',
      is_enabled INTEGER NOT NULL DEFAULT 0,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    -- Newsletter-Abonnenten
    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      first_name TEXT DEFAULT '',
      status TEXT NOT NULL DEFAULT 'pending', -- pending | confirmed | unsubscribed
      doi_token_hash TEXT,
      unsubscribe_token_hash TEXT NOT NULL,
      consent_version TEXT NOT NULL DEFAULT 'v1',
      created_at TEXT NOT NULL,
      confirmed_at TEXT,
      unsubscribed_at TEXT
    );

    -- Service- & TÜV-Erinnerungen (nur per E-Mail, automatisiert alle 24 Monate bis Kunde sich anmeldet)
    CREATE TABLE IF NOT EXISTS service_reminders (
      id TEXT PRIMARY KEY,
      service_type TEXT NOT NULL,
      vehicle_or_object TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      channel TEXT NOT NULL DEFAULT 'email', -- Nur noch per E-Mail
      contact_value TEXT NOT NULL,
      due_year INTEGER NOT NULL,
      due_month INTEGER NOT NULL CHECK(due_month BETWEEN 1 AND 12),
      lead_weeks INTEGER NOT NULL DEFAULT 4,
      notify_at TEXT NOT NULL, -- YYYY-MM-DD
      status TEXT NOT NULL DEFAULT 'scheduled', -- scheduled | notified | completed | cancelled
      auto_cycle_24m INTEGER NOT NULL DEFAULT 1, -- 1 = alle 24 Monate automatisch wiederholen
      customer_signed_up INTEGER NOT NULL DEFAULT 0, -- 1 = Kunde hat sich angemeldet
      cycle_count INTEGER NOT NULL DEFAULT 1,
      verify_token_hash TEXT,
      last_notified_at TEXT,
      notes TEXT DEFAULT '',
      created_at TEXT NOT NULL
    );

    -- Admin-Sessions & Rate-Limiting
    CREATE TABLE IF NOT EXISTS admin_sessions (
      session_token TEXT PRIMARY KEY,
      user_identifier TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS login_attempts (
      ip TEXT PRIMARY KEY,
      attempts INTEGER NOT NULL DEFAULT 1,
      last_attempt TEXT NOT NULL
    );
  `);

  // Spalten-Migration für automatisierte 24-Monate-Zyklen
  try { db.exec("ALTER TABLE service_reminders ADD COLUMN auto_cycle_24m INTEGER NOT NULL DEFAULT 1;"); } catch {}
  try { db.exec("ALTER TABLE service_reminders ADD COLUMN customer_signed_up INTEGER NOT NULL DEFAULT 0;"); } catch {}
  try { db.exec("ALTER TABLE service_reminders ADD COLUMN cycle_count INTEGER NOT NULL DEFAULT 1;"); } catch {}
  try { db.exec("UPDATE service_reminders SET channel = 'email' WHERE channel != 'email';"); } catch {}

  // Automatischen 24-Monate-Zyklus abgleichen
  syncAutomated24mCycles(db);

  // Seed default social links if table is empty
  const socialCount = db.prepare('SELECT COUNT(*) as count FROM social_links').get() as { count: number };
  if (socialCount.count === 0) {
    const insertSocial = db.prepare(`
      INSERT INTO social_links (platform, label, url, is_enabled, sort_order)
      VALUES (?, ?, ?, ?, ?)
    `);
    const defaultSocials = [
      ['instagram', 'Instagram', 'https://instagram.com/pixelundcode', 1, 1],
      ['linkedin', 'LinkedIn', 'https://linkedin.com/company/pixelundcode', 1, 2],
      ['youtube', 'YouTube', '', 0, 3],
      ['tiktok', 'TikTok', '', 0, 4],
      ['facebook', 'Facebook', '', 0, 5],
      ['xing', 'Xing', '', 0, 6],
      ['whatsapp', 'WhatsApp Business', '', 0, 7],
      ['google', 'Google Unternehmensprofil', '', 0, 8],
      ['pinterest', 'Pinterest', '', 0, 9],
    ];
    for (const s of defaultSocials) {
      insertSocial.run(s[0], s[1], s[2], s[3], s[4]);
    }
  }

  // Seed default team members if empty
  const teamCount = db.prepare('SELECT COUNT(*) as count FROM team_members').get() as { count: number };
  if (teamCount.count === 0) {
    const insertTeam = db.prepare(`
      INSERT INTO team_members (id, name, role, bio, photo_url, photo_blur_data, photo_focal_y, sort_order, is_published, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const defaultTeam = [
      ['tm-1', 'Alexander Vance', 'Geschäftsführung & Strategie', 'Über 15 Jahre Erfahrung in digitaler Transformation und ganzheitlicher Markenentwicklung.', '', '', 35, 1, 1, new Date().toISOString()],
      ['tm-2', 'Elena Rostova', 'Creative Director & UI/UX', 'Prämierte Designerin mit Fokus auf intuitive Interfaces, Barrierefreiheit und markante Typografie.', '', '', 35, 2, 1, new Date().toISOString()],
      ['tm-3', 'Marcus Thorne', 'Lead Software Engineer', 'Spezialisiert auf hochperformante Architekturen, Cloud-Infrastruktur und robuste Web-Systeme.', '', '', 35, 3, 1, new Date().toISOString()]
    ];
    for (const t of defaultTeam) {
      insertTeam.run(t[0], t[1], t[2], t[3], t[4], t[5], t[6], t[7], t[8], t[9]);
    }
  }

  // Seed default gallery categories & items if empty
  const galleryCount = db.prepare('SELECT COUNT(*) as count FROM gallery_items').get() as { count: number };
  if (galleryCount.count === 0) {
    const insertCat = db.prepare('INSERT INTO gallery_categories (id, title, sort_order) VALUES (?, ?, ?)');
    insertCat.run('cat-1', 'Web & UI Design', 1);
    insertCat.run('cat-2', 'Branding & Identität', 2);
    insertCat.run('cat-3', 'Entwicklung', 3);

    const insertItem = db.prepare(`
      INSERT INTO gallery_items (id, category_id, title, alt_text, image_url, width, height, blur_data, sort_order, is_published, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const sampleItems = [
      ['gi-1', 'cat-1', 'FinTech Dashboard System', 'Übersichtliches Analytics-Dashboard im dunklen Modus', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80', 1200, 800, '', 1, 1, new Date().toISOString()],
      ['gi-2', 'cat-2', 'Architektur Brand Identity', 'Minimalistisches Corporate Design und Print-Materialien', 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80', 1200, 800, '', 2, 1, new Date().toISOString()],
      ['gi-3', 'cat-3', 'E-Commerce Platform NextGen', 'Responsive Online-Shop Benutzeroberfläche auf Mobilgerät', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80', 1200, 800, '', 3, 1, new Date().toISOString()],
      ['gi-4', 'cat-1', 'Smart Home App Design', 'Mobil-Interface für die intelligente Licht- und Temperatursteuerung', 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1200&q=80', 1200, 800, '', 4, 1, new Date().toISOString()]
    ];
    for (const item of sampleItems) {
      insertItem.run(item[0], item[1], item[2], item[3], item[4], item[5], item[6], item[7], item[8], item[9], item[10]);
    }
  }

  // Seed sample verified reviews if empty
  const reviewCount = db.prepare('SELECT COUNT(*) as count FROM reviews').get() as { count: number };
  if (reviewCount.count === 0) {
    const insertTok = db.prepare('INSERT INTO review_tokens (token_hash, invoice_ref, status, created_at, redeemed_at) VALUES (?, ?, ?, ?, ?)');
    const insertRev = db.prepare(`
      INSERT INTO reviews (id, token_hash, invoice_ref, rating, author_name, comment, photo_url, photo_approved, status, created_at, approved_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const tok1 = 'hash_sample_re_2026_0101';
    insertTok.run(tok1, 'RE-2026-0101', 'redeemed', new Date().toISOString(), new Date().toISOString());
    insertRev.run('rev-1', tok1, 'RE-2026-0101', 5, 'Dr. Thomas Weber', 'Hervorragende Zusammenarbeit bei unserem Relaunch! Schnell, präzise und barrierefrei umgesetzt.', '', 1, 'approved', new Date().toISOString(), new Date().toISOString());

    const tok2 = 'hash_sample_re_2026_0102';
    insertTok.run(tok2, 'RE-2026-0102', 'redeemed', new Date().toISOString(), new Date().toISOString());
    insertRev.run('rev-2', tok2, 'RE-2026-0102', 5, 'Sarah Lindemann', 'Das modulare System spart uns jede Woche mehrere Stunden Pflegeaufwand. Absolut empfehlenswert.', '', 1, 'approved', new Date().toISOString(), new Date().toISOString());
  }
}

/**
 * Automatisiert alle 24 Monate erneuern, bis der Kunde sich anmeldet oder storniert.
 * Prüft fällige Erinnerungen und rückt sie automatisch um 2 Jahre vor.
 */
export function syncAutomated24mCycles(dbInstance?: Database.Database): number {
  const db = dbInstance || getDb();
  const today = new Date().toISOString().slice(0, 10);
  const nowIso = new Date().toISOString();

  // Finde alle aktiven Erinnerungen, bei denen auto_cycle_24m aktiv ist,
  // der Kunde sich noch nicht angemeldet hat (customer_signed_up = 0)
  // und das Fälligkeits-Erinnerungsdatum erreicht ist
  const dueItems = db.prepare(`
    SELECT * FROM service_reminders
    WHERE auto_cycle_24m = 1
      AND customer_signed_up = 0
      AND status NOT IN ('completed', 'cancelled')
      AND notify_at <= ?
  `).all(today) as any[];

  let updatedCount = 0;
  const updateStmt = db.prepare(`
    UPDATE service_reminders
    SET due_year = due_year + 2,
      cycle_count = cycle_count + 1,
      notify_at = ?,
      last_notified_at = ?,
      status = 'scheduled',
      notes = ?
    WHERE id = ?
  `);

  const tx = db.transaction(() => {
    for (const item of dueItems) {
      const newYear = item.due_year + 2;
      const notifyDate = new Date(newYear, item.due_month - 1, 1);
      notifyDate.setDate(notifyDate.getDate() - (item.lead_weeks * 7));
      const newNotifyAt = notifyDate.toISOString().slice(0, 10);

      const cycleMsg = `Automatisch um 24M verlängert (Zyklus #${item.cycle_count + 1} aktiv bis Kunde sich anmeldet)`;
      const newNotes = item.notes ? `${item.notes} | ${cycleMsg}` : cycleMsg;

      updateStmt.run(newNotifyAt, nowIso, newNotes, item.id);
      updatedCount++;
    }
  });

  if (dueItems.length > 0) {
    tx();
  }

  return updatedCount;
}

