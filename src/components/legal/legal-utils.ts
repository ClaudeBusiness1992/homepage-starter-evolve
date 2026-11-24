/* Geteilte Platzhalter-Erkennung für Rechtsangaben aus config/legal.json.
   Ein Wert gilt als Platzhalter, wenn er leer ist oder (nach Trim) mit "[" beginnt.
   String-Schutz: akzeptiert auch nicht-string Werte ohne zu werfen. */
export function isPlaceholder(v: unknown): boolean {
  if (v === null || v === undefined) return true;
  const s = String(v).trim();
  return s.length === 0 || s.startsWith('[');
}

export function safeText(v: unknown): string {
  return String(v ?? '');
}
