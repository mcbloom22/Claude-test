const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', (req, res) => {
  const { all } = req.query;
  let rows;
  if (all === 'true') {
    rows = db.prepare("SELECT * FROM reservations ORDER BY date ASC, time ASC").all();
  } else {
    rows = db
      .prepare("SELECT * FROM reservations WHERE date >= date('now') ORDER BY date ASC, time ASC")
      .all();
  }
  res.json(rows);
});

router.post('/', (req, res) => {
  const { place_id, restaurant_name, date, time, party_size, notes, booking_url } = req.body;

  if (!restaurant_name) return res.status(400).json({ error: 'restaurant_name is required' });
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return res.status(400).json({ error: 'date must be YYYY-MM-DD' });
  if (!time || !/^\d{2}:\d{2}$/.test(time)) return res.status(400).json({ error: 'time must be HH:MM' });
  if (!party_size || party_size < 1) return res.status(400).json({ error: 'party_size must be >= 1' });

  const result = db
    .prepare(
      `INSERT INTO reservations (place_id, restaurant_name, date, time, party_size, notes, booking_url)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(place_id || null, restaurant_name, date, time, party_size, notes || '', booking_url || '');

  res.status(201).json({ id: result.lastInsertRowid });
});

router.patch('/:id', (req, res) => {
  const row = db.prepare('SELECT id FROM reservations WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });

  const { restaurant_name, date, time, party_size, notes, booking_url } = req.body;
  db
    .prepare(
      `UPDATE reservations SET
        restaurant_name = COALESCE(?, restaurant_name),
        date = COALESCE(?, date),
        time = COALESCE(?, time),
        party_size = COALESCE(?, party_size),
        notes = COALESCE(?, notes),
        booking_url = COALESCE(?, booking_url)
       WHERE id = ?`
    )
    .run(restaurant_name, date, time, party_size, notes, booking_url, req.params.id);

  res.json({ ok: true });
});

router.delete('/:id', (req, res) => {
  const row = db.prepare('SELECT id FROM reservations WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });

  db.prepare('DELETE FROM reservations WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
