import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validate, acquireLock, run } from './control.mjs';

const here = dirname(fileURLToPath(import.meta.url));
function fixture(t) { const dir = mkdtempSync(join(here, '.test-')); t.after(() => rmSync(dir, { recursive: true, force: true })); return dir; }
test('validiert Kennung und Domain streng', () => {
  validate('kunde-1', 'beispiel.de');
  for (const [k, d] of [['../a', 'beispiel.de'], ['kunde', 'https://beispiel.de'], ['kunde', '-x.de'], ['kunde', 'x..de']]) assert.throws(() => validate(k, d));
});
test('Trockenlauf zeigt Aufrufplan und wiederholt keine Anbieteraktion', t => {
  const base = fixture(t), lines = [];
  const args = ['kunde-anlegen', '--kunde', 'test', '--domain', 'beispiel.de'];
  for (let i = 0; i < 2; i++) assert.equal(run(args, { base, out: s => lines.push(s) }), 0);
  assert.match(lines.join('\n'), /Vercel-Projekt/); assert.match(lines.join('\n'), /Resend-Domain/); assert.match(lines.join('\n'), /Keine Anbieteraktionen/);
});
test('Sperre verhindert parallele Vorgänge je Kunde', t => {
  const base = fixture(t), release = acquireLock(base, 'test');
  assert.equal(run(['status', '--kunde', 'test', '--domain', 'beispiel.de'], { base, err: () => {} }), 4);
  const releaseOther = acquireLock(base, 'anderer'); releaseOther(); release();
});
test('Protokoll enthält keine Geheimnisse oder Eingaben; Ausführung bleibt gesperrt', t => {
  const base = fixture(t); const marker = 'synthetischer-geheimwert';
  process.env.CONTROL_TEST_SECRET = marker;
  t.after(() => delete process.env.CONTROL_TEST_SECRET);
  assert.equal(run(['go', '--kunde', 'test', '--domain', 'beispiel.de', '--ausfuehren'], { base, err: () => {} }), 3);
  const log = readFileSync(join(base, 'aktionen.jsonl'), 'utf8');
  assert.doesNotMatch(log, /synthetischer-geheimwert|beispiel\.de|test/);
  assert.equal(JSON.parse(log).ergebnis, 'ausfuehren-gesperrt');
  assert.equal(run(['go', '--kunde', 'test', '--domain', 'beispiel.de', '--ausfuehren', '--ja'], { base, err: () => {} }), 2);
});
