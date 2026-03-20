'use client';

import { useEffect, useState } from 'react';
import { getRestaurantDetail, saveRestaurant, getSaved, unsaveRestaurant } from '@/lib/api';
import ExternalLinks from './ExternalLinks';
import ReservationForm from './ReservationForm';

export default function RestaurantDetail({ placeId, onClose, onSaveChange }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [savedId, setSavedId] = useState(null);
  const [showReservationForm, setShowReservationForm] = useState(false);

  useEffect(() => {
    async function load() {
      const [d, savedList] = await Promise.all([
        getRestaurantDetail(placeId),
        getSaved(),
      ]);
      setDetail(d);
      const match = savedList.find((s) => s.place_id === placeId);
      if (match) { setSaved(true); setSavedId(match.id); }
      setLoading(false);
    }
    load();
  }, [placeId]);

  async function toggleSave() {
    if (saved) {
      await unsaveRestaurant(savedId);
      setSaved(false);
      setSavedId(null);
    } else {
      const { id } = await saveRestaurant({
        place_id: placeId,
        name: detail.name,
        address: detail.address,
        google_rating: detail.google_rating,
        yelp_rating: detail.yelp_rating,
        yelp_url: detail.yelp_url,
        photo_url: detail.photos?.[0] || null,
      });
      setSaved(true);
      setSavedId(id);
    }
    onSaveChange?.();
  }

  const priceStr = detail?.price_level ? '$'.repeat(detail.price_level) : null;

  return (
    <div className="fixed inset-0 z-30 flex flex-col bg-white max-w-lg mx-auto">
      {/* Header photo */}
      <div className="relative">
        {detail?.photos?.[0] ? (
          <img src={detail.photos[0]} alt={detail?.name} className="w-full h-52 object-cover" />
        ) : (
          <div className="w-full h-52 bg-gray-100 flex items-center justify-center text-6xl">🍽️</div>
        )}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 bg-white/90 backdrop-blur rounded-full w-9 h-9 flex items-center justify-center text-lg shadow"
        >
          ←
        </button>
        {!loading && (
          <button
            onClick={toggleSave}
            className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-full w-9 h-9 flex items-center justify-center text-lg shadow"
          >
            {saved ? '🔖' : '＋'}
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Name + meta */}
            <div>
              <h2 className="text-2xl font-bold leading-tight">{detail.name}</h2>
              {detail.address && <p className="text-sm text-gray-400 mt-1">{detail.address}</p>}
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                {detail.google_rating && (
                  <span className="text-sm font-medium text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full">
                    ★ {detail.google_rating} Google{detail.google_reviews ? ` (${detail.google_reviews.toLocaleString()})` : ''}
                  </span>
                )}
                {detail.yelp_rating && (
                  <span className="text-sm font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                    ★ {detail.yelp_rating} Yelp{detail.yelp_review_count ? ` (${detail.yelp_review_count.toLocaleString()})` : ''}
                  </span>
                )}
                {priceStr && <span className="text-sm text-gray-400">{priceStr}</span>}
              </div>
            </div>

            {/* Yelp categories */}
            {detail.yelp_categories?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {detail.yelp_categories.map((c) => (
                  <span key={c} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{c}</span>
                ))}
              </div>
            )}

            {/* Hours */}
            {detail.hours && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Hours</p>
                {detail.hours.map((h) => (
                  <p key={h} className="text-sm text-gray-600">{h}</p>
                ))}
              </div>
            )}

            {/* Phone / website */}
            {(detail.phone || detail.website) && (
              <div className="flex gap-3">
                {detail.phone && (
                  <a href={`tel:${detail.phone}`} className="text-sm text-brand font-medium">
                    📞 {detail.phone}
                  </a>
                )}
                {detail.website && (
                  <a href={detail.website} target="_blank" rel="noopener noreferrer" className="text-sm text-brand font-medium">
                    🌐 Website
                  </a>
                )}
              </div>
            )}

            {/* External links */}
            <ExternalLinks
              name={detail.name}
              address={detail.address}
              yelpUrl={detail.yelp_url}
            />

            {/* Photos row */}
            {detail.photos?.length > 1 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Photos</p>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {detail.photos.slice(1).map((url, i) => (
                    <img key={i} src={url} alt="" className="h-24 w-32 rounded-xl object-cover shrink-0" />
                  ))}
                </div>
              </div>
            )}

            {/* Reserve button */}
            <button
              onClick={() => setShowReservationForm(true)}
              className="w-full bg-brand text-white rounded-2xl py-3.5 font-semibold text-base active:scale-[0.98] transition-transform shadow-sm"
            >
              Log a Reservation
            </button>
          </div>
        </div>
      )}

      {showReservationForm && (
        <ReservationForm
          restaurantName={detail?.name}
          placeId={placeId}
          onClose={() => setShowReservationForm(false)}
          onSaved={() => setShowReservationForm(false)}
        />
      )}
    </div>
  );
}
