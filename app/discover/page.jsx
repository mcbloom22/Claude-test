'use client';

import { useState } from 'react';
import BottomNav from '@/components/BottomNav';
import SearchBar from '@/components/SearchBar';
import RestaurantCard from '@/components/RestaurantCard';
import RestaurantDetail from '@/components/RestaurantDetail';
import { searchRestaurants } from '@/lib/api';

export default function DiscoverPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  async function handleSearch(q, location) {
    setLoading(true);
    setError(null);
    try {
      const data = await searchRestaurants(q, location);
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto pb-20">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 pt-safe">
          <h1 className="text-xl font-bold text-brand mb-3">Reserve</h1>
          <SearchBar onSearch={handleSearch} />
        </div>

        <div className="px-4 py-3">
          {loading && (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {error && (
            <p className="text-red-500 text-sm text-center py-6">{error}</p>
          )}
          {!loading && !error && results.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">🍽️</p>
              <p className="text-base font-medium">Search for a restaurant</p>
              <p className="text-sm mt-1">Try "sushi NYC" or "pasta Brooklyn"</p>
            </div>
          )}
          <div className="space-y-3">
            {results.map((r) => (
              <RestaurantCard key={r.place_id} restaurant={r} onClick={() => setSelected(r.place_id)} />
            ))}
          </div>
        </div>
      </div>

      <BottomNav />

      {selected && (
        <RestaurantDetail placeId={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
