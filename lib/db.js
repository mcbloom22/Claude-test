import { sql } from '@vercel/postgres';

export async function initDb() {
  await sql`
    CREATE TABLE IF NOT EXISTS saved_restaurants (
      id            SERIAL PRIMARY KEY,
      place_id      TEXT UNIQUE NOT NULL,
      name          TEXT NOT NULL,
      address       TEXT,
      cuisine       TEXT,
      google_rating NUMERIC,
      yelp_rating   NUMERIC,
      yelp_url      TEXT,
      photo_url     TEXT,
      notes         TEXT DEFAULT '',
      saved_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS reservations (
      id              SERIAL PRIMARY KEY,
      place_id        TEXT,
      restaurant_name TEXT NOT NULL,
      date            DATE NOT NULL,
      time            TIME NOT NULL,
      party_size      INTEGER NOT NULL,
      notes           TEXT DEFAULT '',
      booking_url     TEXT,
      created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}

export { sql };
