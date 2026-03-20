'use client';

import { useEffect, useState } from 'react';
import BottomNav from '@/components/BottomNav';
import ReservationList from '@/components/ReservationList';
import ReservationForm from '@/components/ReservationForm';
import { getReservations, deleteReservation } from '@/lib/api';

export default function ReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showAll, setShowAll] = useState(false);

  async function load() {
    try {
      setReservations(await getReservations(showAll));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [showAll]);

  async function handleCancel(id) {
    await deleteReservation(id);
    setReservations((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto pb-20">
        <div className="px-4 py-4 pt-safe border-b border-gray-100 bg-white flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Reservations</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {showAll ? 'All reservations' : 'Upcoming only'}
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-brand text-white rounded-full w-10 h-10 flex items-center justify-center text-xl shadow-md active:scale-95 transition-transform"
          >
            +
          </button>
        </div>

        <div className="px-4 py-3">
          <button
            onClick={() => setShowAll((v) => !v)}
            className="text-xs text-brand font-medium mb-4"
          >
            {showAll ? 'Show upcoming only' : 'Show all (including past)'}
          </button>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <ReservationList reservations={reservations} onCancel={handleCancel} />
          )}
        </div>
      </div>

      <BottomNav />

      {showForm && (
        <ReservationForm
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); load(); }}
        />
      )}
    </div>
  );
}
