import { sql } from '@vercel/postgres';

export async function initDb() {
  await sql`
    CREATE TABLE IF NOT EXISTS saved_restaurants (
      id       SERIAL PRIMARY KEY,
      place_id TEXT UNIQUE NOT NULL,
      notes    TEXT DEFAULT '',
      saved_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  // Drop legacy columns if they exist (one-time migration)
  await sql`ALTER TABLE saved_restaurants DROP COLUMN IF EXISTS name`;
  await sql`ALTER TABLE saved_restaurants DROP COLUMN IF EXISTS address`;
  await sql`ALTER TABLE saved_restaurants DROP COLUMN IF EXISTS cuisine`;
  await sql`ALTER TABLE saved_restaurants DROP COLUMN IF EXISTS google_rating`;
  await sql`ALTER TABLE saved_restaurants DROP COLUMN IF EXISTS yelp_rating`;
  await sql`ALTER TABLE saved_restaurants DROP COLUMN IF EXISTS yelp_url`;
  await sql`ALTER TABLE saved_restaurants DROP COLUMN IF EXISTS photo_url`;

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
