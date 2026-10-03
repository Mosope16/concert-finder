export type GenreCategory =
  | 'all'
  | 'pop'
  | 'hip-hop'
  | 'electronic'
  | 'rock-indie'
  | 'afrobeats'
  | 'r-and-b'
  | 'jazz-soul'
  | 'metal';

export type EventType =
  | 'all'
  | 'stadium-tour'
  | 'arena'
  | 'festival'
  | 'intimate-club'
  | 'amphitheater';

export type TicketStatus =
  | 'on-sale'
  | 'selling-fast'
  | 'low-tickets'
  | 'sold-out';

export interface TicketTier {
  id: string;
  name: string;
  price: number;
  perks: string[];
  available: boolean;
}

export interface AudioSample {
  track_name: string;
  preview_synth_frequency?: number;
  bpm: number;
  vibe_color: string;
  duration_seconds: number;
}

export interface ConcertEvent {
  id: string;
  title: string;
  artist: string;
  artist_image: string;
  banner_image: string;
  genre: GenreCategory;
  event_type: EventType;
  date: string; // ISO date string
  doors_time: string;
  city: string;
  venue_name: string;
  venue_address: string;
  lat: number;
  lng: number;
  price_min: number;
  price_max: number;
  currency: string;
  ticket_status: TicketStatus;
  tickets_remaining_pct: number;
  setlist_preview: string[];
  audio_sample: AudioSample;
  description: string;
  support_acts: string[];
  age_restriction: string;
  rsvps_count: number;
  is_featured: boolean;
  ticket_tiers: TicketTier[];
  deal_rating: 'great-deal' | 'fair-price' | 'vip-tier';
}

export interface UserRSVP {
  id: string;
  concert_id: string;
  user_name: string;
  ticket_tier: string;
  attending_status: 'going' | 'interested';
  created_at: string;
}

export interface FilterState {
  searchQuery: string;
  city: string;
  genre: GenreCategory;
  eventType: EventType;
  ticketStatus: 'all' | 'available-only';
  maxPrice: number;
  timeRange: 'all' | 'this-week' | 'this-month' | 'festivals';
  sortBy: 'date' | 'price-low' | 'price-high' | 'popularity';
}
