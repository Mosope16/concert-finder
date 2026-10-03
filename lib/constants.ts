import { GenreCategory, EventType, TicketStatus } from './types';

export const CITIES = [
  { name: 'All Cities', value: 'all', lat: 40.7128, lng: -74.006, zoom: 4 },
  { name: 'New York, NY', value: 'New York, NY', lat: 40.7128, lng: -74.006, zoom: 12 },
  { name: 'Los Angeles, CA', value: 'Los Angeles, CA', lat: 34.0522, lng: -118.2437, zoom: 11 },
  { name: 'London, UK', value: 'London, UK', lat: 51.5074, lng: -0.1278, zoom: 11 },
  { name: 'Chicago, IL', value: 'Chicago, IL', lat: 41.8781, lng: -87.6298, zoom: 12 },
  { name: 'Austin, TX', value: 'Austin, TX', lat: 30.2672, lng: -97.7431, zoom: 12 },
  { name: 'Berlin, DE', value: 'Berlin, DE', lat: 52.52, lng: 13.405, zoom: 12 },
  { name: 'Lagos, NG', value: 'Lagos, NG', lat: 6.5244, lng: 3.3792, zoom: 12 }
];

export const GENRE_METADATA: Record<GenreCategory, { label: string; color: string; bgClass: string; borderClass: string; icon: string }> = {
  all: {
    label: 'All Genres',
    color: '#c084fc',
    bgClass: 'bg-purple-500/10 text-purple-400',
    borderClass: 'border-purple-500/30',
    icon: 'Music'
  },
  pop: {
    label: 'Pop & Anthems',
    color: '#f43f5e',
    bgClass: 'bg-rose-500/10 text-rose-400',
    borderClass: 'border-rose-500/30',
    icon: 'Sparkles'
  },
  'hip-hop': {
    label: 'Hip-Hop & Rap',
    color: '#fbbf24',
    bgClass: 'bg-amber-500/10 text-amber-400',
    borderClass: 'border-amber-500/30',
    icon: 'Mic2'
  },
  electronic: {
    label: 'Electronic & DJ',
    color: '#06b6d4',
    bgClass: 'bg-cyan-500/10 text-cyan-400',
    borderClass: 'border-cyan-500/30',
    icon: 'Disc'
  },
  'rock-indie': {
    label: 'Rock & Indie',
    color: '#ef4444',
    bgClass: 'bg-red-500/10 text-red-400',
    borderClass: 'border-red-500/30',
    icon: 'Guitar'
  },
  afrobeats: {
    label: 'Afrobeats & Amapiano',
    color: '#10b981',
    bgClass: 'bg-emerald-500/10 text-emerald-400',
    borderClass: 'border-emerald-500/30',
    icon: 'Flame'
  },
  'r-and-b': {
    label: 'R&B / Soul',
    color: '#818cf8',
    bgClass: 'bg-indigo-500/10 text-indigo-400',
    borderClass: 'border-indigo-500/30',
    icon: 'Heart'
  },
  'jazz-soul': {
    label: 'Jazz & Groove',
    color: '#d97706',
    bgClass: 'bg-yellow-600/10 text-yellow-500',
    borderClass: 'border-yellow-600/30',
    icon: 'Radio'
  },
  metal: {
    label: 'Metal & Punk',
    color: '#94a3b8',
    bgClass: 'bg-slate-500/10 text-slate-400',
    borderClass: 'border-slate-500/30',
    icon: 'Zap'
  }
};

export const TICKET_STATUS_META: Record<TicketStatus, { label: string; badgeClass: string; dotColor: string }> = {
  'on-sale': {
    label: 'On Sale',
    badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    dotColor: '#10b981'
  },
  'selling-fast': {
    label: 'Selling Fast',
    badgeClass: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    dotColor: '#f59e0b'
  },
  'low-tickets': {
    label: 'Low Tickets (<10%)',
    badgeClass: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    dotColor: '#f43f5e'
  },
  'sold-out': {
    label: 'Sold Out / Resale Only',
    badgeClass: 'bg-slate-800/80 text-slate-400 border-slate-700',
    dotColor: '#64748b'
  }
};
