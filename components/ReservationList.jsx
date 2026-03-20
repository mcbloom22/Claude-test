'use client';

import { useState } from 'react';
import { format, parseISO, isPast } from 'date-fns';
import ConfirmDialog from './ConfirmDialog';

function ReservationCard({ reservation: r, onCancel }) {
  const [confirming, setConfirming] = useState(false);
  const dateObj = parseISO(r.date);
  const past = isPast(dateObj);

  return (
    <>
      <div className={`bg-white rounded-2xl shadow-sm p-4 ${past ? 'opacity-60' : ''}`}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-base leading-tight">{r.restaurant_name}</p>
            <p className="text-sm text-gray-500 mt-0.5">
              {format(dateObj, 'EEE, MMM d yyyy')} · {r.time.slice(0, 5)}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {r.party_size} {r.party_size === 1 ? 'person' : 'people'}
            </p>
          </div>
          <div className="shrink-0">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${past ? 'bg-gray-100 text-gray-400' : 'bg-green-50 text-green-700'}`}>
              {past ? 'Past' : 'Upcoming'}
            </span>
          </div>
        </div>

        {r.notes && <p className="text-sm text-gray-500 mt-2 italic">{r.notes}</p>}

        <div className="flex items-center justify-between mt-3">
          {r.booking_url ? (
            <a
              href={r.booking_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-brand font-medium"
            >
              View booking ↗
            </a>
          ) : <span />}
          {!past && (
            <button
              onClick={() => setConfirming(true)}
              className="text-xs text-red-400 hover:text-red-600 transition-colors"
            >
              Cancel reservation
            </button>
          )}
        </div>
      </div>

      {confirming && (
        <ConfirmDialog
          message={`Cancel your reservation at ${r.restaurant_name}?`}
          onConfirm={() => { setConfirming(false); onCancel(r.id); }}
          onCancel={() => setConfirming(false)}
        />
      )}
    </>
  );
}

export default function ReservationList({ reservations, onCancel }) {
  if (reservations.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-4xl mb-3">📅</p>
        <p className="text-base font-medium">No reservations yet</p>
        <p className="text-sm mt-1">Tap + to log one</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {reservations.map((r) => (
        <ReservationCard key={r.id} reservation={r} onCancel={onCancel} />
      ))}
    </div>
  );
}
