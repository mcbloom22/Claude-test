'use client';

import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { createReservation } from '@/lib/api';
import 'react-day-picker/dist/style.css';

export default function ReservationForm({ restaurantName, placeId, onClose, onSaved }) {
  const [name, setName] = useState(restaurantName || '');
  const [date, setDate] = useState(null);
  const [time, setTime] = useState('19:00');
  const [partySize, setPartySize] = useState(2);
  const [notes, setNotes] = useState('');
  const [bookingUrl, setBookingUrl] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  function validate() {
    const e = {};
    if (!name.trim()) e.name = 'Restaurant name is required';
    if (!date) e.date = 'Pick a date';
    if (!time) e.time = 'Pick a time';
    if (!partySize || partySize < 1) e.partySize = 'At least 1 person';
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setSaving(true);
    try {
      await createReservation({
        place_id: placeId || null,
        restaurant_name: name.trim(),
        date: format(date, 'yyyy-MM-dd'),
        time,
        party_size: Number(partySize),
        notes: notes.trim(),
        booking_url: bookingUrl.trim(),
      });
      onSaved?.();
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-white max-w-lg mx-auto">
      <div className="flex items-center justify-between px-4 py-4 pt-safe border-b border-gray-100">
        <h2 className="text-lg font-bold">Log Reservation</h2>
        <button onClick={onClose} className="text-gray-400 text-2xl leading-none">×</button>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-safe">
        {/* Restaurant name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Restaurant name"
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <button
            type="button"
            onClick={() => setShowPicker((v) => !v)}
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-left focus:outline-none focus:ring-2 focus:ring-brand/30"
          >
            {date ? format(date, 'EEEE, MMMM d, yyyy') : 'Pick a date'}
          </button>
          {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
          {showPicker && (
            <div className="mt-2 bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
              <DayPicker
                mode="single"
                selected={date}
                onSelect={(d) => { setDate(d); setShowPicker(false); }}
                disabled={{ before: new Date() }}
                className="!font-sans"
              />
            </div>
          )}
        </div>

        {/* Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
          {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
        </div>

        {/* Party size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Party size</label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPartySize((v) => Math.max(1, v - 1))}
              className="w-10 h-10 rounded-full border border-gray-200 text-xl font-medium active:bg-gray-50"
            >
              −
            </button>
            <span className="text-lg font-semibold w-6 text-center">{partySize}</span>
            <button
              type="button"
              onClick={() => setPartySize((v) => Math.min(20, v + 1))}
              className="w-10 h-10 rounded-full border border-gray-200 text-xl font-medium active:bg-gray-50"
            >
              +
            </button>
          </div>
          {errors.partySize && <p className="text-red-500 text-xs mt-1">{errors.partySize}</p>}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes <span className="text-gray-400 font-normal">(optional)</span></label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Occasion, dietary needs…"
            rows={2}
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 resize-none"
          />
        </div>

        {/* Booking URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Booking link <span className="text-gray-400 font-normal">(optional)</span></label>
          <input
            type="url"
            value={bookingUrl}
            onChange={(e) => setBookingUrl(e.target.value)}
            placeholder="OpenTable / Resy confirmation URL"
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
        </div>

        {errors.submit && <p className="text-red-500 text-sm">{errors.submit}</p>}

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-brand text-white rounded-2xl py-3.5 font-semibold text-base active:scale-[0.98] transition-transform shadow-sm disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save Reservation'}
        </button>
      </form>
    </div>
  );
}
