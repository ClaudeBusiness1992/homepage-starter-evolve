export const prerender = false;

import type { APIRoute } from 'astro';
import { getDb, syncAutomated24mCycles } from '../../../../lib/db';
import { validateSession } from '../../../../lib/auth';
import { hasPermission } from '../../../../lib/permissions';

export const GET: APIRoute = async ({ request }) => {
  const cookie = request.headers.get('cookie');
  if (!validateSession(cookie)) {
    return new Response(JSON.stringify({ error: 'Nicht angemeldet' }), { status: 401 });
  }

  const db = getDb();

  // Führt automatischen 24-Monate-Zyklusabgleich für fällige Einträge durch
  const autoRenewed = syncAutomated24mCycles(db);

  const reminders = db.prepare(`
    SELECT * FROM service_reminders
    ORDER BY customer_signed_up ASC, due_year ASC, due_month ASC, created_at DESC
  `).all();

  // Zähler für Fälligkeiten
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const dueThisMonth = reminders.filter((r: any) =>
    r.customer_signed_up === 0 &&
    r.status !== 'completed' &&
    ((r.due_year === currentYear && r.due_month === currentMonth) || (r.due_year < currentYear))
  ).length;

  const activeAutoCycles = reminders.filter((r: any) => r.auto_cycle_24m === 1 && r.customer_signed_up === 0).length;

  return new Response(JSON.stringify({
    reminders,
    autoRenewed,
    stats: {
      dueThisMonth,
      activeAutoCycles,
      total: reminders.length,
    },
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const PATCH: APIRoute = async ({ request }) => {
  const cookie = request.headers.get('cookie');
  if (!validateSession(cookie)) {
    return new Response(JSON.stringify({ error: 'Nicht angemeldet' }), { status: 401 });
  }
  if (!hasPermission('canManageReminders')) {
    return new Response(JSON.stringify({ error: 'Keine Berechtigung' }), { status: 403 });
  }

  try {
    const body = await request.json();
    const { id, action, notes } = body;
    if (!id) {
      return new Response(JSON.stringify({ error: 'ID erforderlich' }), { status: 400 });
    }

    const db = getDb();
    const item = db.prepare('SELECT * FROM service_reminders WHERE id = ?').get(id) as any;
    if (!item) {
      return new Response(JSON.stringify({ error: 'Erinnerung nicht gefunden' }), { status: 404 });
    }

    const now = new Date().toISOString();

    if (action === 'customer_signed_up' || action === 'mark_signed_up') {
      // Kunde hat sich zum Termin angemeldet
      const noteMsg = 'Kunde hat sich zum Termin angemeldet (Termin wahrgenommen)';
      const updatedNotes = item.notes ? `${item.notes} | ${noteMsg}` : noteMsg;

      db.prepare(`
        UPDATE service_reminders
        SET customer_signed_up = 1, status = 'completed', notes = ?
        WHERE id = ?
      `).run(updatedNotes, id);

      return new Response(JSON.stringify({
        success: true,
        message: 'Kunde als angemeldet markiert. Der 24-Monate-Zyklus pausiert für diesen Termin.'
      }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } else if (action === 'extend_cycle') {
      // Manuelle Verlängerung um 24 Monate
      const addYears = body.years || 2;
      const newYear = item.due_year + addYears;
      const monthStr = String(item.due_month).padStart(2, '0');
      const notifyDate = new Date(newYear, item.due_month - 1, 1);
      notifyDate.setDate(notifyDate.getDate() - (item.lead_weeks * 7));
      const newNotifyAt = notifyDate.toISOString().slice(0, 10);

      const cycleMsg = `Um 24M verlängert bis ${monthStr}/${newYear}`;
      const updatedNotes = (notes !== undefined ? notes : (item.notes ? `${item.notes} | ${cycleMsg}` : cycleMsg));

      db.prepare(`
        UPDATE service_reminders
        SET due_year = ?, notify_at = ?, status = 'scheduled', customer_signed_up = 0, cycle_count = cycle_count + 1, notes = ?
        WHERE id = ?
      `).run(newYear, newNotifyAt, updatedNotes, id);

      return new Response(JSON.stringify({
        success: true,
        message: `Erinnerung erfolgreich um 24 Monate bis ${monthStr}/${newYear} verlängert.`,
      }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } else if (action === 'toggle_auto_cycle') {
      const nextVal = item.auto_cycle_24m === 1 ? 0 : 1;
      db.prepare(`
        UPDATE service_reminders
        SET auto_cycle_24m = ?
        WHERE id = ?
      `).run(nextVal, id);

      return new Response(JSON.stringify({
        success: true,
        auto_cycle_24m: nextVal,
        message: nextVal === 1 ? 'Automatischer 24-Monate-Zyklus aktiviert.' : 'Automatischer 24-Monate-Zyklus pausiert.'
      }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } else if (action === 'mark_notified') {
      db.prepare(`
        UPDATE service_reminders
        SET status = 'notified', last_notified_at = ?
        WHERE id = ?
      `).run(now, id);
    } else if (action === 'update_notes') {
      db.prepare(`
        UPDATE service_reminders
        SET notes = ?
        WHERE id = ?
      `).run(notes || '', id);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  const cookie = request.headers.get('cookie');
  if (!validateSession(cookie)) {
    return new Response(JSON.stringify({ error: 'Nicht angemeldet' }), { status: 401 });
  }
  if (!hasPermission('canManageReminders')) {
    return new Response(JSON.stringify({ error: 'Keine Berechtigung' }), { status: 403 });
  }

  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) {
    return new Response(JSON.stringify({ error: 'ID erforderlich' }), { status: 400 });
  }

  const db = getDb();
  db.prepare('DELETE FROM service_reminders WHERE id = ?').run(id);

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
