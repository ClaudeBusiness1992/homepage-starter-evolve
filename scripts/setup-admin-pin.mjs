import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';

if (!process.stdin.isTTY) throw new Error('A terminal is required');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const target = path.join(root, 'data/config/site.config.json');
fs.mkdirSync(path.dirname(target), { recursive: true });
if (!fs.existsSync(target)) {
  try {
    fs.copyFileSync(path.join(root, 'config-examples/site.config.example.json'), target, fs.constants.COPYFILE_EXCL);
    fs.chmodSync(target, 0o600);
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
  }
}
const config = JSON.parse(fs.readFileSync(target, 'utf8'));
process.stdout.write('Enter a new admin PIN (input hidden): ');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.resume();
let pin = '';
process.stdin.on('keypress', (character, key) => {
  if (key?.ctrl && key.name === 'c') {
    process.stdin.setRawMode(false);
    process.exit(1);
  }
  if (key?.name === 'return') {
    process.stdin.setRawMode(false);
    process.stdin.pause();
    process.stdout.write('\n');
    if (!pin.trim()) throw new Error('PIN must not be empty');
    const salt = crypto.randomBytes(16);
    const digest = crypto.scryptSync(pin.trim(), salt, 64);
    config.auth = { ...config.auth, adminPinHash: `scrypt$${salt.toString('hex')}$${digest.toString('hex')}` };
    delete config.auth.adminPin;
    fs.writeFileSync(target, JSON.stringify(config, null, 2) + '\n', { mode: 0o600 });
    fs.chmodSync(target, 0o600);
    pin = '';
    process.stdout.write('Admin PIN configured.\n');
  } else if (key?.name === 'backspace') {
    pin = pin.slice(0, -1);
  } else if (character && !key?.ctrl && !key?.meta && character.length === 1) {
    pin += character;
  }
});
