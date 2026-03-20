import { NextResponse } from 'next/server';
import axios from 'axios';

const GOOGLE_KEY = process.env.GOOGLE_PLACES_API_KEY;
const YELP_KEY = process.env.YELP_API_KEY;

export async function GET(request, { params }) {
  const { placeId } = await params;
  if (!GOOGLE_KEY) return NextResponse.json({ error: 'Google Places API key not configured' }, { status: 503 });

  try {
    const googleRes = await axios.get(
      'https://maps.googleapis.com/maps/api/place/details/json',
      {
        params: {
          place_id: placeId,
          fields: 'name,formatted_address,rating,user_ratings_total,price_level,formatted_phone_number,opening_hours,website,photos,types,geometry',
          key: GOOGLE_KEY,
        },
      }
    );

    const p = googleRes.data.result || {};
    const detail = {
      place_id: placeId,
      name: p.name,
      address: p.formatted_address,
      phone: p.formatted_phone_number,
      website: p.website,
      google_rating: p.rating,
      google_reviews: p.user_ratings_total,
      price_level: p.price_level,
      hours: p.opening_hours?.weekday_text || null,
      photos: (p.photos || []).slice(0, 5).map(
        (ph) => `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${ph.photo_reference}&key=${GOOGLE_KEY}`
      ),
      location: p.geometry?.location || null,
      types: p.types || [],
    };

    if (YELP_KEY && p.name && p.geometry?.location) {
      try {
        const yelpRes = await axios.get('https://api.yelp.com/v3/businesses/search', {
          headers: { Authorization: `Bearer ${YELP_KEY}` },
          params: { term: p.name, latitude: p.geometry.location.lat, longitude: p.geometry.location.lng, limit: 1 },
        });
        const biz = yelpRes.data.businesses?.[0];
        if (biz) {
          detail.yelp_rating = biz.rating;
          detail.yelp_review_count = biz.review_count;
          detail.yelp_url = biz.url;
          detail.yelp_price = biz.price;
          detail.yelp_categories = biz.categories?.map((c) => c.title) || [];
        }
      } catch (yelpErr) {
        console.warn('Yelp match failed:', yelpErr.message);
      }
    }

    return NextResponse.json(detail);
  } catch (err) {
    console.error('Place details error:', err.message);
    return NextResponse.json({ error: 'Failed to fetch place details' }, { status: 502 });
  }
}
