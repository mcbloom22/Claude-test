import { NextResponse } from 'next/server';
import { sql, initDb } from '@/lib/db';

export async function GET() {
  await initDb();
  const { rows } = await sql`SELECT * FROM saved_restaurants ORDER BY saved_at DESC`;
  return NextResponse.json(rows);
}

export async function POST(request) {
  await initDb();
  const { place_id, name, address, cuisine, google_rating, yelp_rating, yelp_url, photo_url, notes } =
    await request.json();

  if (!place_id || !name) return NextResponse.json({ error: 'place_id and name are required' }, { status: 400 });

  try {
    const { rows } = await sql`
      INSERT INTO saved_restaurants (place_id, name, address, cuisine, google_rating, yelp_rating, yelp_url, photo_url, notes)
      VALUES (${place_id}, ${name}, ${address || ''}, ${cuisine || ''}, ${google_rating || null},
              ${yelp_rating || null}, ${yelp_url || ''}, ${photo_url || ''}, ${notes || ''})
      ON CONFLICT (place_id) DO NOTHING
      RETURNING id
    `;
    if (!rows[0]) return NextResponse.json({ error: 'Already saved' }, { status: 409 });
    return NextResponse.json({ id: rows[0].id }, { status: 201 });
  } catch (err) {
    console.error('Save error:', err.message);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
