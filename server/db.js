const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, 'reservations.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS saved_restaurants (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    place_id      TEXT UNIQUE NOT NULL,
    name          TEXT NOT NULL,
    address       TEXT,
    cuisine       TEXT,
    google_rating REAL,
    yelp_rating   REAL,
    yelp_url      TEXT,
    photo_url     TEXT,
    notes         TEXT DEFAULT '',
    saved_at      TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS reservations (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    place_id        TEXT,
    restaurant_name TEXT NOT NULL,
    date            TEXT NOT NULL,
    time            TEXT NOT NULL,
    party_size      INTEGER NOT NULL,
    notes           TEXT DEFAULT '',
    booking_url     TEXT,
    created_at      TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

module.exports = db;
