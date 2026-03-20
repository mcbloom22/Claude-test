export default function ExternalLinks({ name, address, yelpUrl, partySize = 2, date, time }) {
  const city = address ? address.split(',').slice(-2).join(',').trim() : '';
  const encodedName = encodeURIComponent(name || '');
  const encodedCity = encodeURIComponent(city);

  // Build OpenTable URL with optional date/party params
  let openTableUrl = `https://www.opentable.com/s/?term=${encodedName}&covers=${partySize}`;
  if (date && time) openTableUrl += `&dateTime=${encodeURIComponent(`${date}T${time}`)}`;

  // Resy city slug (best-effort from address)
  const citySlug = city.toLowerCase().split(',')[0].trim().replace(/\s+/g, '-');
  const resyUrl = `https://resy.com/cities/${citySlug}?query=${encodedName}`;

  const links = [
    {
      label: 'Yelp',
      url: yelpUrl || `https://www.yelp.com/search?find_desc=${encodedName}&find_loc=${encodedCity}`,
      color: 'bg-red-50 text-red-600',
      emoji: '⭐',
    },
    {
      label: 'Beli',
      url: `https://beliapp.com/restaurants`,
      color: 'bg-orange-50 text-orange-600',
      emoji: '🍴',
    },
    {
      label: 'Infatuation',
      url: `https://www.theinfatuation.com/search?query=${encodedName}`,
      color: 'bg-pink-50 text-pink-600',
      emoji: '💗',
    },
    {
      label: 'OpenTable',
      url: openTableUrl,
      color: 'bg-green-50 text-green-700',
      emoji: '📗',
    },
    {
      label: 'Resy',
      url: resyUrl,
      color: 'bg-indigo-50 text-indigo-600',
      emoji: '📘',
    },
  ];

  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Open in</p>
      <div className="flex flex-wrap gap-2">
        {links.map((l) => (
          <a
            key={l.label}
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${l.color} active:opacity-70 transition-opacity`}
          >
            <span>{l.emoji}</span>
            {l.label}
          </a>
        ))}
      </div>
    </div>
  );
}
