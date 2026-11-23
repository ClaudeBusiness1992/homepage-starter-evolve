import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Deterministische Pfadauflösung relativ zur Datei selbst, unabhängig vom Aufrufverzeichnis process.cwd()
export const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const DATA_DIR = path.join(PROJECT_ROOT, 'data');
export const CONFIG_DIR = path.join(DATA_DIR, 'config');
export const RUNTIME_DIR = path.join(DATA_DIR, 'runtime');
export const PUBLIC_UPLOADS_DIR = path.join(PROJECT_ROOT, 'public/uploads');
export const DB_PATH = path.join(RUNTIME_DIR, 'site.sqlite');
export const SITE_CONFIG_FILE = path.join(CONFIG_DIR, 'site.config.json');
export const PERMISSIONS_FILE = path.join(CONFIG_DIR, 'permissions.json');
