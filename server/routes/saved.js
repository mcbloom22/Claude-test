const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM saved_restaurants ORDER BY saved_at DESC').all();
  res.json(rows);
});

router.post('/', (req, res) => {
  const { place_id, name, address, cuisine, google_rating, yelp_rating, yelp_url, photo_url, notes } = req.body;
  if (!place_id || !name) return res.status(400).json({ error: 'place_id and name are required' });

  const existing = db.prepare('SELECT id FROM saved_restaurants WHERE place_id = ?').get(place_id);
  if (existing) return res.status(409).json({ error: 'Already saved', id: existing.id });

  const result = db
    .prepare(
      `INSERT INTO saved_restaurants (place_id, name, address, cuisine, google_rating, yelp_rating, yelp_url, photo_url, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(place_id, name, address || '', cuisine || '', google_rating || null, yelp_rating || null, yelp_url || '', photo_url || '', notes || '');

  res.status(201).json({ id: result.lastInsertRowid });
});

router.patch('/:id', (req, res) => {
  const { notes } = req.body;
  const row = db.prepare('SELECT id FROM saved_restaurants WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });

  db.prepare('UPDATE saved_restaurants SET notes = ? WHERE id = ?').run(notes ?? '', req.params.id);
  res.json({ ok: true });
});

router.delete('/:id', (req, res) => {
  const row = db.prepare('SELECT id FROM saved_restaurants WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });

  db.prepare('DELETE FROM saved_restaurants WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
