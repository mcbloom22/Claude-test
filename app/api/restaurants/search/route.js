import { NextResponse } from 'next/server';
import axios from 'axios';

const GOOGLE_KEY = process.env.GOOGLE_PLACES_API_KEY;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  const location = searchParams.get('location') || '';

  if (!q) return NextResponse.json({ error: 'q is required' }, { status: 400 });
  if (!GOOGLE_KEY) return NextResponse.json({ error: 'Google Places API key not configured' }, { status: 503 });

  try {
    const query = location ? `${q} restaurants in ${location}` : `${q} restaurants`;
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/place/textsearch/json',
      { params: { query, type: 'restaurant', key: GOOGLE_KEY } }
    );

    const places = (response.data.results || []).map((p) => ({
      place_id: p.place_id,
      name: p.name,
      address: p.formatted_address,
      rating: p.rating,
      price_level: p.price_level,
      photo_url: p.photos?.[0]
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${p.photos[0].photo_reference}&key=${GOOGLE_KEY}`
        : null,
      types: p.types,
    }));

    return NextResponse.json(places);
  } catch (err) {
    console.error('Google search error:', err.message);
    return NextResponse.json({ error: 'Failed to fetch from Google Places' }, { status: 502 });
  }
}
