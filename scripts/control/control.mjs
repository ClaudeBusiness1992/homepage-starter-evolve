#!/usr/bin/env node
import { mkdirSync, appendFileSync, rmdirSync, openSync, closeSync, readSync, writeSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const plans = {
  'kunde-anlegen': ['Freigegebenes Kernpaket prüfen', 'Vercel-Projekt anlegen', 'Domains zuordnen und DNS prüfen', 'Projektbegrenzten Vercel-Schlüssel erstellen', 'Datenbank und kundeneigene Rolle einrichten', 'Kundenbezogenen Schnittstellenschlüssel erstellen', 'Resend-Domain und kundeneigenen Schlüssel anlegen', 'Vorschau serverseitig sperren und noindex setzen', 'Standardeinstellungen anlegen'],
  'update-vorschau': ['Freigegebenes Paket und Kompatibilität prüfen', 'Zeitweilige Vorschau im bestehenden Vercel-Projekt erstellen', 'Vorschau serverseitig sperren; Versand und Tracking ausschließen', 'Audit für den konkreten Stand vorbereiten'],
  go: ['Geprüften Vorschau- und Auditstand sowie Kompatibilität prüfen', 'Sicherung vor jeder Datenbankmigration erstellen und prüfen', 'Genau den geprüften Stand aktivieren, ohne Inhalte zu überschreiben', 'Live-Zustand und Vorschau-Sperre prüfen'],
  zurueck: ['Kompatibilität und verfügbaren vorherigen Stand prüfen', 'Bei Unvereinbarkeit Rückweg sperren', 'Kompatiblen vorherigen Stand aktivieren, Inhalte erhalten'],
  status: ['Kundenprojekt, Kernversion und verfügbare Aktualisierung abfragen', 'Vorschau-Sperre, Audit und Ampel einschließlich Prüfzeit abfragen']
};

export function validate(customer, domain) {
  if (typeof customer !== 'string' || !/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(customer)) throw new Error('Kundenkennung: nur Kleinbuchstaben, Ziffern und interne Bindestriche, maximal 63 Zeichen.');
  if (typeof domain !== 'string' || domain.length > 253 || !domain.includes('.') || domain !== domain.toLowerCase() || !domain.split('.').every(part => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(part)) || !/^[a-z]{2,63}$/.test(domain.split('.').at(-1))) throw new Error('Domain: gültigen kleingeschriebenen DNS-Namen ohne Protokoll oder Pfad angeben.');
}

export function acquireLock(base, customer) {
  mkdirSync(base, { recursive: true, mode: 0o700 });
  const lock = join(base, `${customer}.lock`);
  try { mkdirSync(lock, { mode: 0o700 }); } catch (e) { if (e.code === 'EEXIST') { const err = new Error('Für diesen Kunden läuft bereits ein Vorgang oder eine Sperre ist liegen geblieben.'); err.code = 'LOCKED'; throw err; } throw e; }
  return () => rmdirSync(lock);
}

export function logAction(base, command, outcome) {
  // Nur feste Werte: keine Argumente, Domains, Umgebungsvariablen oder Fehlertexte.
  if (!Object.hasOwn(plans, command) || !['trockenlauf', 'ausfuehren-gesperrt'].includes(outcome)) throw new Error('Ungültiger Protokolleintrag.');
  appendFileSync(join(base, 'aktionen.jsonl'), JSON.stringify({ zeit: new Date().toISOString(), befehl: command, ergebnis: outcome }) + '\n', { mode: 0o600 });
}

export function parse(args) {
  const command = args[0];
  if (!Object.hasOwn(plans, command)) throw new Error('Unbekannter Befehl.');
  let customer, domain, execute = false;
  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--ausfuehren' && !execute) execute = true;
    else if (arg === '--kunde' && customer === undefined && args[i + 1] && !args[i + 1].startsWith('--')) customer = args[++i];
    else if (arg === '--domain' && domain === undefined && args[i + 1] && !args[i + 1].startsWith('--')) domain = args[++i];
    else throw new Error('Ungültiges oder doppeltes Argument.');
  }
  validate(customer, domain);
  return { command, customer, domain, execute };
}

// A controlling terminal is required; stdin and command-line flags cannot approve Go.
export function confirmGo() {
  let fd;
  try {
    fd = openSync('/dev/tty', 'r+');
    writeSync(fd, 'Go bestätigen? Tippe GO und drücke Enter: ');
    const bytes = Buffer.alloc(32);
    let used = 0;
    while (used < bytes.length) {
      const n = readSync(fd, bytes, used, 1, null);
      if (n === 0) return false;
      if (bytes[used++] === 10) break;
    }
    return bytes.subarray(0, used).toString('utf8') === 'GO\n';
  } catch { return false; } finally { if (fd !== undefined) closeSync(fd); }
}

export function run(args, { base = join(root, '.runtime'), out = console.log, err = console.error } = {}) {
  let input;
  try { input = parse(args); } catch (e) { err(e.message); return 2; }
  let release;
  let result = 0;
  try {
    release = acquireLock(base, input.customer);
    if (input.execute) {
      logAction(base, input.command, 'ausfuehren-gesperrt');
      if (input.command === 'go' && !confirmGo()) err('Keine gültige Terminalbestätigung.');
      err('Ausführung ist noch nicht implementiert und bleibt gesperrt.');
      result = 3;
    } else {
    logAction(base, input.command, 'trockenlauf');
    out(`Trockenlauf: ${input.command} für ${input.customer} (${input.domain})`);
    plans[input.command].forEach((step, i) => out(`${i + 1}. ${step} [Platzhalter]`));
    out('Keine Anbieteraktionen ausgeführt; keine Schlüssel gelesen.');
    }
  } catch (e) {
    err(e.code === 'LOCKED' ? e.message : 'Lokaler Sperr- oder Protokollfehler.');
    result = e.code === 'LOCKED' ? 4 : 5;
  } finally { if (release) { try { release(); } catch { err('Sperre konnte nicht entfernt werden; manuelle Prüfung erforderlich.'); result = 5; } } }
  return result;
}
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) process.exitCode = run(process.argv.slice(2));
