export default function RestaurantCard({ restaurant: r, onClick }) {
  const priceStr = r.price_level ? '$'.repeat(r.price_level) : null;

  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-2xl shadow-sm overflow-hidden text-left active:scale-[0.98] transition-transform"
    >
      <div className="flex gap-3 p-3">
        {r.photo_url ? (
          <img src={r.photo_url} alt={r.name} className="w-20 h-20 rounded-xl object-cover shrink-0" />
        ) : (
          <div className="w-20 h-20 rounded-xl bg-gray-100 shrink-0 flex items-center justify-center text-3xl">
            🍽️
          </div>
        )}
        <div className="flex-1 min-w-0 py-0.5">
          <p className="font-semibold text-sm leading-tight truncate">{r.name}</p>
          {r.address && <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{r.address}</p>}
          <div className="flex items-center gap-2 mt-2">
            {r.rating && (
              <span className="text-xs font-medium text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full">
                ★ {r.rating}
              </span>
            )}
            {priceStr && (
              <span className="text-xs text-gray-400">{priceStr}</span>
            )}
            {r.open_now === true && (
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Open</span>
            )}
            {r.open_now === false && (
              <span className="text-xs font-medium text-red-500 bg-red-50 px-2 py-0.5 rounded-full">Closed</span>
            )}
          </div>
        </div>
        <span className="text-gray-300 self-center text-lg shrink-0">›</span>
      </div>
    </button>
  );
}
