import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function PATCH(request, { params }) {
  const { id } = await params;
  const { notes } = await request.json();
  const { rows } = await sql`UPDATE saved_restaurants SET notes = ${notes ?? ''} WHERE id = ${id} RETURNING id`;
  if (!rows[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const { rows } = await sql`DELETE FROM saved_restaurants WHERE id = ${id} RETURNING id`;
  if (!rows[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
