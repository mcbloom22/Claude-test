const express = require('express');
const axios = require('axios');
const router = express.Router();

const GOOGLE_KEY = process.env.GOOGLE_PLACES_API_KEY;
const YELP_KEY = process.env.YELP_API_KEY;

// Search restaurants via Google Places Text Search
router.get('/search', async (req, res) => {
  const { q, location } = req.query;
  if (!q) return res.status(400).json({ error: 'q is required' });

  if (!GOOGLE_KEY) {
    return res.status(503).json({ error: 'Google Places API key not configured' });
  }

  try {
    const query = location ? `${q} restaurants in ${location}` : `${q} restaurants`;
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/place/textsearch/json',
      {
        params: {
          query,
          type: 'restaurant',
          key: GOOGLE_KEY,
        },
      }
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

    res.json(places);
  } catch (err) {
    console.error('Google search error:', err.message);
    res.status(502).json({ error: 'Failed to fetch from Google Places' });
  }
});

// Get place details (Google) + Yelp match
router.get('/:placeId', async (req, res) => {
  const { placeId } = req.params;

  if (!GOOGLE_KEY) {
    return res.status(503).json({ error: 'Google Places API key not configured' });
  }

  try {
    const [googleRes] = await Promise.all([
      axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
        params: {
          place_id: placeId,
          fields:
            'name,formatted_address,rating,user_ratings_total,price_level,formatted_phone_number,opening_hours,website,photos,types,geometry',
          key: GOOGLE_KEY,
        },
      }),
    ]);

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
        (ph) =>
          `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${ph.photo_reference}&key=${GOOGLE_KEY}`
      ),
      location: p.geometry?.location || null,
      types: p.types || [],
    };

    // Try Yelp match if key is configured
    if (YELP_KEY && p.name && p.geometry?.location) {
      try {
        const yelpRes = await axios.get(
          'https://api.yelp.com/v3/businesses/search',
          {
            headers: { Authorization: `Bearer ${YELP_KEY}` },
            params: {
              term: p.name,
              latitude: p.geometry.location.lat,
              longitude: p.geometry.location.lng,
              limit: 1,
            },
          }
        );
        const biz = yelpRes.data.businesses?.[0];
        if (biz) {
          detail.yelp_rating = biz.rating;
          detail.yelp_review_count = biz.review_count;
          detail.yelp_url = biz.url;
          detail.yelp_price = biz.price;
          detail.yelp_categories = biz.categories?.map((c) => c.title) || [];
        }
      } catch (yelpErr) {
        // Yelp is optional — don't fail the whole request
        console.warn('Yelp match failed:', yelpErr.message);
      }
    }

    res.json(detail);
  } catch (err) {
    console.error('Place details error:', err.message);
    res.status(502).json({ error: 'Failed to fetch place details' });
  }
});

module.exports = router;
