import { NextResponse } from 'next/server';
import { sql, initDb } from '@/lib/db';

export async function GET(request) {
  await initDb();
  const { searchParams } = new URL(request.url);
  const all = searchParams.get('all') === 'true';

  const { rows } = all
    ? await sql`SELECT * FROM reservations ORDER BY date ASC, time ASC`
    : await sql`SELECT * FROM reservations WHERE date >= CURRENT_DATE ORDER BY date ASC, time ASC`;

  return NextResponse.json(rows);
}

export async function POST(request) {
  await initDb();
  const { place_id, restaurant_name, date, time, party_size, notes, booking_url } = await request.json();

  if (!restaurant_name) return NextResponse.json({ error: 'restaurant_name is required' }, { status: 400 });
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return NextResponse.json({ error: 'date must be YYYY-MM-DD' }, { status: 400 });
  if (!time || !/^\d{2}:\d{2}$/.test(time)) return NextResponse.json({ error: 'time must be HH:MM' }, { status: 400 });
  if (!party_size || party_size < 1) return NextResponse.json({ error: 'party_size must be ≥ 1' }, { status: 400 });

  const { rows } = await sql`
    INSERT INTO reservations (place_id, restaurant_name, date, time, party_size, notes, booking_url)
    VALUES (${place_id || null}, ${restaurant_name}, ${date}, ${time}, ${party_size}, ${notes || ''}, ${booking_url || ''})
    RETURNING id
  `;
  return NextResponse.json({ id: rows[0].id }, { status: 201 });
}
