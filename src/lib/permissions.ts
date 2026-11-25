import fs from 'node:fs';
import path from 'node:path';

export interface PermissionsConfig {
  schemaVersion: number;
  sections: {
    team: { enabled: boolean };
    gallery: { enabled: boolean };
    reviews: { enabled: boolean };
    social: { enabled: boolean };
    newsletter: { enabled: boolean };
    reminders: { enabled: boolean };
  };
  permissions: {
    canEditTeam: boolean;
    canEditGallery: boolean;
    canManageReviews: boolean;
    canEditSocial: boolean;
    canManageNewsletter: boolean;
    canManageReminders: boolean;
  };
}

import { PERMISSIONS_FILE, PROJECT_ROOT } from './paths.ts';

const DEFAULT_PERMISSIONS: PermissionsConfig = {
  schemaVersion: 1,
  sections: {
    team: { enabled: true },
    gallery: { enabled: true },
    reviews: { enabled: true },
    social: { enabled: true },
    newsletter: { enabled: true },
    reminders: { enabled: true },
  },
  permissions: {
    canEditTeam: true,
    canEditGallery: true,
    canManageReviews: true,
    canEditSocial: true,
    canManageNewsletter: true,
    canManageReminders: true,
  },
};

export function getPermissions(): PermissionsConfig {
  try {
    if (fs.existsSync(PERMISSIONS_FILE)) {
      const raw = fs.readFileSync(PERMISSIONS_FILE, 'utf-8');
      return JSON.parse(raw) as PermissionsConfig;
    }
  } catch (err) {
    console.error('[permissions] Fehler beim Laden von permissions.json:', err);
  }
  fs.mkdirSync(path.dirname(PERMISSIONS_FILE), { recursive: true });
  try {
    fs.copyFileSync(path.join(PROJECT_ROOT, 'config-examples/permissions.example.json'), PERMISSIONS_FILE, fs.constants.COPYFILE_EXCL);
    fs.chmodSync(PERMISSIONS_FILE, 0o600);
  } catch (err: any) {
    if (err.code !== 'EEXIST') throw err;
    return JSON.parse(fs.readFileSync(PERMISSIONS_FILE, 'utf-8')) as PermissionsConfig;
  }
  return DEFAULT_PERMISSIONS;
}

export function savePermissions(config: PermissionsConfig): void {
  try {
    fs.mkdirSync(path.dirname(PERMISSIONS_FILE), { recursive: true });
    fs.writeFileSync(PERMISSIONS_FILE, JSON.stringify(config, null, 2), 'utf-8');
  } catch (err) {
    console.error('[permissions] Fehler beim Speichern von permissions.json:', err);
    throw err;
  }
}

export function hasPermission(key: keyof PermissionsConfig['permissions']): boolean {
  const cfg = getPermissions();
  return Boolean(cfg.permissions && cfg.permissions[key]);
}

export function isSectionEnabled(key: keyof PermissionsConfig['sections']): boolean {
  const cfg = getPermissions();
  return Boolean(cfg.sections && cfg.sections[key]?.enabled);
}
