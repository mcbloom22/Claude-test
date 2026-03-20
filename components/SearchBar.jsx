'use client';

import { useState } from 'react';

export default function SearchBar({ onSearch }) {
  const [q, setQ] = useState('');
  const [location, setLocation] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (q.trim()) onSearch(q.trim(), location.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Cuisine, restaurant name…"
        className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 bg-gray-50"
      />
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="City / area"
        className="w-28 rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 bg-gray-50"
      />
      <button
        type="submit"
        className="bg-brand text-white rounded-xl px-4 py-2 text-sm font-medium active:scale-95 transition-transform shrink-0"
      >
        Go
      </button>
    </form>
  );
}
