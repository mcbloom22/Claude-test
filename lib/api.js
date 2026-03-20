// Client-side fetch helpers

async function request(path, options = {}) {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || res.statusText);
  }
  return res.json();
}

// Restaurants (search + detail)
export const searchRestaurants = (q, location) =>
  request(`/api/restaurants/search?q=${encodeURIComponent(q)}&location=${encodeURIComponent(location || '')}`);

export const getRestaurantDetail = (placeId) =>
  request(`/api/restaurants/${placeId}`);

// Saved / wishlist
export const getSaved = () => request('/api/saved');
export const saveRestaurant = (data) => request('/api/saved', { method: 'POST', body: JSON.stringify(data) });
export const unsaveRestaurant = (id) => request(`/api/saved/${id}`, { method: 'DELETE' });
export const updateSavedNotes = (id, notes) =>
  request(`/api/saved/${id}`, { method: 'PATCH', body: JSON.stringify({ notes }) });

// Reservations
export const getReservations = (all = false) => request(`/api/reservations${all ? '?all=true' : ''}`);
export const createReservation = (data) => request('/api/reservations', { method: 'POST', body: JSON.stringify(data) });
export const updateReservation = (id, data) =>
  request(`/api/reservations/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
export const deleteReservation = (id) => request(`/api/reservations/${id}`, { method: 'DELETE' });
