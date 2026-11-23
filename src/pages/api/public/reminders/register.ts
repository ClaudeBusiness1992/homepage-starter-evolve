export const prerender = false;

import type { APIRoute } from 'astro';
import { getDb } from '../../../../lib/db';
import { randomToken } from '../../../../lib/crypto';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const serviceType = (body.serviceType || 'Hauptuntersuchung (HU / TÜV)').trim();
    const vehicleOrObject = (body.vehicleOrObject || '').trim();
    const customerName = (body.customerName || '').trim();
    const contactValue = (body.contactValue || '').trim().toLowerCase();
    const dueYear = parseInt(body.dueYear, 10);
    const dueMonth = parseInt(body.dueMonth, 10);
    const leadWeeks = parseInt(body.leadWeeks, 10) || 4;
    const honeypot = body.website || ''; // Anti-Spam

    if (honeypot) {
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!vehicleOrObject || !customerName || !contactValue) {
      return new Response(JSON.stringify({ error: 'Bitte füllen Sie alle Pflichtfelder aus.' }), { status: 400 });
    }

    // Streng nur E-Mail
    if (!contactValue.includes('@') || !contactValue.includes('.')) {
      return new Response(JSON.stringify({ error: 'Bitte geben Sie eine gültige E-Mail-Adresse für die Terminerinnerung ein.' }), { status: 400 });
    }

    if (isNaN(dueYear) || isNaN(dueMonth) || dueMonth < 1 || dueMonth > 12) {
      return new Response(JSON.stringify({ error: 'Bitte wählen Sie einen gültigen Fälligkeitsmonat und ein Jahr.' }), { status: 400 });
    }

    // Berechne notify_at
    const notifyDate = new Date(dueYear, dueMonth - 1, 1);
    notifyDate.setDate(notifyDate.getDate() - (leadWeeks * 7));
    const notifyAt = notifyDate.toISOString().slice(0, 10);

    const db = getDb();
    const id = 'rem-' + randomToken(6);
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO service_reminders (
        id, service_type, vehicle_or_object, customer_name, channel, contact_value,
        due_year, due_month, lead_weeks, notify_at, status, auto_cycle_24m, customer_signed_up, cycle_count, created_at
      )
      VALUES (?, ?, ?, ?, 'email', ?, ?, ?, ?, ?, 'scheduled', 1, 0, 1, ?)
    `).run(id, serviceType, vehicleOrObject, customerName, contactValue, dueYear, dueMonth, leadWeeks, notifyAt, now);

    return new Response(JSON.stringify({
      success: true,
      message: `Vielen Dank, ${customerName}! Wir erinnern Sie rechtzeitig 4 Wochen vor dem Termin verlässlich per E-Mail — und danach automatisch alle 24 Monate bis Sie sich zum Termin anmelden.`
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('[api/public/reminders/register POST]', err);
    return new Response(JSON.stringify({ error: err.message || 'Fehler beim Speichern der Erinnerung' }), { status: 500 });
  }
};
