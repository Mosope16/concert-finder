import { ConcertEvent, UserRSVP } from './types';
import { INITIAL_CONCERTS } from './data/seed-concerts';

const CONCERTS_STORAGE_KEY = 'concert_finder_events_v1';
const SAVED_SHOWS_STORAGE_KEY = 'concert_finder_saved_v1';
const RSVPS_STORAGE_KEY = 'concert_finder_rsvps_v1';

export function getStoredConcerts(): ConcertEvent[] {
  if (typeof window === 'undefined') return INITIAL_CONCERTS;
  try {
    const raw = localStorage.getItem(CONCERTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CONCERTS_STORAGE_KEY, JSON.stringify(INITIAL_CONCERTS));
      return INITIAL_CONCERTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_CONCERTS;
  }
}

export function saveStoredConcerts(concerts: ConcertEvent[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CONCERTS_STORAGE_KEY, JSON.stringify(concerts));
  } catch (e) {
    console.error('Failed to save concerts to localStorage', e);
  }
}

export function getSavedConcertIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SAVED_SHOWS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleSavedConcert(concertId: string): string[] {
  if (typeof window === 'undefined') return [];
  const current = getSavedConcertIds();
  const exists = current.includes(concertId);
  const updated = exists ? current.filter((id) => id !== concertId) : [...current, concertId];
  try {
    localStorage.setItem(SAVED_SHOWS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to update saved concerts', e);
  }
  return updated;
}

export function getUserRSVPs(): UserRSVP[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(RSVPS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function recordUserRSVP(
  concertId: string,
  userName: string,
  ticketTier: string,
  attendingStatus: 'going' | 'interested'
): { rsvp: UserRSVP; updatedConcert: ConcertEvent | null } {
  const rsvp: UserRSVP = {
    id: 'rsvp-' + Date.now(),
    concert_id: concertId,
    user_name: userName || 'Fellow Fan',
    ticket_tier: ticketTier,
    attending_status: attendingStatus,
    created_at: new Date().toISOString()
  };

  if (typeof window !== 'undefined') {
    try {
      const current = getUserRSVPs();
      localStorage.setItem(RSVPS_STORAGE_KEY, JSON.stringify([rsvp, ...current]));
    } catch (e) {
      console.error('Failed to persist RSVP', e);
    }
  }

  // Update rsvps_count on concert
  const concerts = getStoredConcerts();
  const targetIndex = concerts.findIndex((c) => c.id === concertId);
  if (targetIndex !== -1) {
    concerts[targetIndex].rsvps_count += 1;
    saveStoredConcerts(concerts);
    return { rsvp, updatedConcert: concerts[targetIndex] };
  }

  return { rsvp, updatedConcert: null };
}
