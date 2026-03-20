import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function PATCH(request, { params }) {
  const { id } = await params;
  const { restaurant_name, date, time, party_size, notes, booking_url } = await request.json();

  const { rows } = await sql`
    UPDATE reservations SET
      restaurant_name = COALESCE(${restaurant_name}, restaurant_name),
      date            = COALESCE(${date}, date),
      time            = COALESCE(${time}, time),
      party_size      = COALESCE(${party_size}, party_size),
      notes           = COALESCE(${notes}, notes),
      booking_url     = COALESCE(${booking_url}, booking_url)
    WHERE id = ${id}
    RETURNING id
  `;
  if (!rows[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const { rows } = await sql`DELETE FROM reservations WHERE id = ${id} RETURNING id`;
  if (!rows[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
