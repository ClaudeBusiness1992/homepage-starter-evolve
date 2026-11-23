import { getDb } from './db.ts';
import { randomToken, sha256 } from './crypto.ts';
import { SITE_CONFIG_FILE } from './paths.ts';
import fs from 'node:fs';
import path from 'node:path';

const SESSION_COOKIE_NAME = 'hps_admin_session';
const SESSION_DURATION_DAYS = 30;

function getSiteConfig() {
  try {
    if (fs.existsSync(SITE_CONFIG_FILE)) {
      return JSON.parse(fs.readFileSync(SITE_CONFIG_FILE, 'utf-8'));
    }
  } catch {}
  return { auth: { adminPin: '123456' } };
}

export function checkRateLimit(ip: string): { allowed: boolean; remainingAttempts: number } {
  const db = getDb();
  const row = db.prepare('SELECT attempts, last_attempt FROM login_attempts WHERE ip = ?').get(ip) as { attempts: number; last_attempt: string } | undefined;

  const now = Date.now();
  if (row) {
    const lastTime = new Date(row.last_attempt).getTime();
    // 15 Minuten Sperre nach 5 Fehlversuchen
    if (row.attempts >= 5 && now - lastTime < 15 * 60 * 1000) {
      return { allowed: false, remainingAttempts: 0 };
    }
    // Nach 15 Minuten zurücksetzen
    if (now - lastTime >= 15 * 60 * 1000) {
      db.prepare('DELETE FROM login_attempts WHERE ip = ?').run(ip);
      return { allowed: true, remainingAttempts: 5 };
    }
    return { allowed: true, remainingAttempts: Math.max(0, 5 - row.attempts) };
  }
  return { allowed: true, remainingAttempts: 5 };
}

export function recordFailedLogin(ip: string): void {
  const db = getDb();
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO login_attempts (ip, attempts, last_attempt)
    VALUES (?, 1, ?)
    ON CONFLICT(ip) DO UPDATE SET attempts = attempts + 1, last_attempt = ?
  `).run(ip, now, now);
}

export function resetLoginAttempts(ip: string): void {
  const db = getDb();
  db.prepare('DELETE FROM login_attempts WHERE ip = ?').run(ip);
}

export function verifyAdminPin(enteredPin: string): boolean {
  const cfg = getSiteConfig();
  const expectedPin = cfg?.auth?.adminPin || '123456';
  return Boolean(enteredPin && enteredPin.trim() === expectedPin.trim());
}

export function createAdminSession(userIdentifier = 'admin'): { token: string; cookieHeader: string } {
  const db = getDb();
  const token = randomToken(32);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000);

  db.prepare(`
    INSERT INTO admin_sessions (session_token, user_identifier, expires_at, created_at)
    VALUES (?, ?, ?, ?)
  `).run(token, userIdentifier, expiresAt.toISOString(), now.toISOString());

  const cookieHeader = `${SESSION_COOKIE_NAME}=${token}; Path=/; Max-Age=${SESSION_DURATION_DAYS * 24 * 60 * 60}; HttpOnly; SameSite=Lax`;
  return { token, cookieHeader };
}

export function validateSession(cookieHeaderOrToken?: string | null): boolean {
  if (!cookieHeaderOrToken) return false;
  let token = cookieHeaderOrToken;
  const match = cookieHeaderOrToken.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE_NAME}=([^;]+)`));
  if (match) {
    token = match[1];
  }

  const db = getDb();
  const session = db.prepare('SELECT session_token, expires_at FROM admin_sessions WHERE session_token = ?').get(token) as { session_token: string; expires_at: string } | undefined;

  if (!session) return false;

  if (new Date(session.expires_at).getTime() < Date.now()) {
    db.prepare('DELETE FROM admin_sessions WHERE session_token = ?').run(token);
    return false;
  }

  return true;
}

export function destroySession(cookieHeaderOrToken?: string | null): string {
  if (cookieHeaderOrToken) {
    let token = cookieHeaderOrToken;
    const match = cookieHeaderOrToken.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE_NAME}=([^;]+)`));
    if (match) {
      token = match[1];
    }
    const db = getDb();
    db.prepare('DELETE FROM admin_sessions WHERE session_token = ?').run(token);
  }
  return `${SESSION_COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`;
}
