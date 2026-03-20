'use client';

import { useEffect, useState } from 'react';
import BottomNav from '@/components/BottomNav';
import RestaurantDetail from '@/components/RestaurantDetail';
import { getSaved, unsaveRestaurant, updateSavedNotes } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';

export default function SavedPage() {
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  async function load() {
    try {
      setSaved(await getSaved());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleUnsave(id) {
    await unsaveRestaurant(id);
    setSaved((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto pb-20">
        <div className="px-4 py-4 pt-safe border-b border-gray-100 bg-white">
          <h1 className="text-xl font-bold">Saved</h1>
          <p className="text-sm text-gray-400 mt-0.5">Your restaurant wishlist</p>
        </div>

        <div className="px-4 py-3">
          {loading && (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {!loading && saved.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">🔖</p>
              <p className="text-base font-medium">No saved restaurants yet</p>
              <p className="text-sm mt-1">Search and save restaurants you want to try</p>
            </div>
          )}
          <div className="space-y-3">
            {saved.map((r) => (
              <div key={r.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {r.photo_url && (
                  <img src={r.photo_url} alt={r.name} className="w-full h-36 object-cover" />
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <button
                        onClick={() => setSelected(r.place_id)}
                        className="text-left font-semibold text-base leading-tight hover:text-brand transition-colors"
                      >
                        {r.name}
                      </button>
                      {r.address && <p className="text-xs text-gray-400 mt-0.5 truncate">{r.address}</p>}
                    </div>
                    <div className="flex gap-2 shrink-0 items-center">
                      {r.google_rating && (
                        <span className="text-xs font-medium bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full">
                          ★ {r.google_rating}
                        </span>
                      )}
                      {r.yelp_rating && (
                        <span className="text-xs font-medium bg-red-50 text-red-600 px-2 py-0.5 rounded-full">
                          Y {r.yelp_rating}
                        </span>
                      )}
                    </div>
                  </div>
                  {r.notes && (
                    <p className="text-sm text-gray-500 mt-2 italic">{r.notes}</p>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-300">
                      Saved {formatDistanceToNow(new Date(r.saved_at), { addSuffix: true })}
                    </span>
                    <button
                      onClick={() => handleUnsave(r.id)}
                      className="text-xs text-red-400 hover:text-red-600 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />

      {selected && (
        <RestaurantDetail placeId={selected} onClose={() => setSelected(null)} onSaveChange={load} />
      )}
    </div>
  );
}
