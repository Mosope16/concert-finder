-- ==============================================================================
-- PROJECT #4: CONCERT FINDER - SUPABASE DATABASE SCHEMA
-- Note: All tables are explicitly prefixed with `concert_*` so they can safely
-- coexist inside a shared Supabase database without conflicting with other projects.
-- ==============================================================================

-- 1. Concert Events Table
CREATE TABLE IF NOT EXISTS concert_events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  artist_image TEXT NOT NULL,
  banner_image TEXT NOT NULL,
  genre TEXT NOT NULL,
  event_type TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  doors_time TEXT NOT NULL,
  city TEXT NOT NULL,
  venue_name TEXT NOT NULL,
  venue_address TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  price_min NUMERIC NOT NULL,
  price_max NUMERIC NOT NULL,
  currency TEXT DEFAULT 'USD',
  ticket_status TEXT NOT NULL,
  tickets_remaining_pct INT DEFAULT 100,
  setlist_preview JSONB DEFAULT '[]'::jsonb,
  audio_sample JSONB DEFAULT '{}'::jsonb,
  description TEXT,
  support_acts JSONB DEFAULT '[]'::jsonb,
  age_restriction TEXT DEFAULT 'All Ages',
  rsvps_count INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  ticket_tiers JSONB DEFAULT '[]'::jsonb,
  deal_rating TEXT DEFAULT 'fair-price',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. User RSVPs and Squad Planner
CREATE TABLE IF NOT EXISTS concert_rsvps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  concert_id TEXT REFERENCES concert_events(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  ticket_tier TEXT,
  attending_status TEXT CHECK (attending_status IN ('going', 'interested')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Saved Shows / Bookmarks
CREATE TABLE IF NOT EXISTS concert_saved_shows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  concert_id TEXT REFERENCES concert_events(id) ON DELETE CASCADE,
  user_identifier TEXT NOT NULL,
  saved_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE concert_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE concert_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE concert_saved_shows ENABLE ROW LEVEL SECURITY;

-- Anonymous read policies (Public live tour feed)
CREATE POLICY "Public read concert events" ON concert_events FOR SELECT USING (true);
CREATE POLICY "Public read concert rsvps" ON concert_rsvps FOR SELECT USING (true);
CREATE POLICY "Public insert concert rsvps" ON concert_rsvps FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read saved shows" ON concert_saved_shows FOR SELECT USING (true);
CREATE POLICY "Public insert saved shows" ON concert_saved_shows FOR INSERT WITH CHECK (true);
