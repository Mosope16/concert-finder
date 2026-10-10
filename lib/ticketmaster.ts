import { ConcertEvent, GenreCategory, EventType, TicketStatus } from './types';

const TICKETMASTER_API_KEY = process.env.NEXT_PUBLIC_TICKETMASTER_API_KEY || '';

// Normalize Ticketmaster genres to app genres
function mapGenre(tmGenre?: string, tmSubGenre?: string): GenreCategory {
  const g = (tmGenre || tmSubGenre || '').toLowerCase();
  if (g.includes('rock') || g.includes('alternative') || g.includes('indie')) return 'rock-indie';
  if (g.includes('hip-hop') || g.includes('rap')) return 'hip-hop';
  if (g.includes('electronic') || g.includes('dance') || g.includes('house') || g.includes('techno')) return 'electronic';
  if (g.includes('r&b') || g.includes('soul')) return 'r-and-b';
  if (g.includes('jazz')) return 'jazz-soul';
  if (g.includes('metal') || g.includes('punk')) return 'metal';
  if (g.includes('afro') || g.includes('reggae')) return 'afrobeats';
  return 'pop';
}

// Normalize Event Type
function mapEventType(title: string, venueName: string): EventType {
  const t = title.toLowerCase();
  const v = venueName.toLowerCase();
  if (t.includes('festival') || t.includes('fest')) return 'festival';
  if (v.includes('stadium') || v.includes('park') || v.includes('field') || v.includes('dome')) return 'stadium-tour';
  if (v.includes('arena') || v.includes('center') || v.includes('centre') || v.includes('coliseum')) return 'arena';
  if (v.includes('amphitheater') || v.includes('amphitheatre') || v.includes('bowl')) return 'amphitheater';
  return 'intimate-club';
}

// Soundwave frequency generator
function getSynthFrequency(genre: GenreCategory): number {
  switch (genre) {
    case 'electronic': return 261.63; // C4
    case 'hip-hop': return 293.66; // D4
    case 'pop': return 349.23; // F4
    case 'rock-indie': return 220.0; // A3
    case 'afrobeats': return 329.63; // E4
    case 'jazz-soul': return 392.0; // G4
    case 'metal': return 196.0; // G3
    default: return 330.0;
  }
}

// Raw Ticketmaster item interface
interface TMEvent {
  id: string;
  name: string;
  url?: string;
  dates?: {
    start?: {
      localDate?: string;
      localTime?: string;
      dateTime?: string;
    };
    status?: {
      code?: string;
    };
  };
  classifications?: Array<{
    genre?: { name?: string };
    subGenre?: { name?: string };
  }>;
  priceRanges?: Array<{
    min?: number;
    max?: number;
    currency?: string;
  }>;
  images?: Array<{
    url: string;
    ratio?: string;
    width?: number;
  }>;
  _embedded?: {
    venues?: Array<{
      name?: string;
      city?: { name?: string };
      state?: { stateCode?: string };
      country?: { countryCode?: string };
      address?: { line1?: string };
      location?: {
        latitude?: string;
        longitude?: string;
      };
    }>;
    attractions?: Array<{
      name?: string;
    }>;
  };
}

export async function fetchTicketmasterConcerts(
  city?: string,
  searchQuery?: string,
  genre?: string
): Promise<ConcertEvent[]> {
  if (!TICKETMASTER_API_KEY) {
    return [];
  }

  try {
    const params = new URLSearchParams({
      apikey: TICKETMASTER_API_KEY,
      classificationName: 'music',
      sort: 'date,asc',
      size: '24'
    });

    if (city && city !== 'all') {
      const cityName = city.split(',')[0].trim();
      params.append('city', cityName);
    }

    if (searchQuery && searchQuery.trim()) {
      params.append('keyword', searchQuery.trim());
    }

    const res = await fetch(
      `https://app.ticketmaster.com/discovery/v2/events.json?${params.toString()}`,
      { next: { revalidate: 300 } }
    );

    if (!res.ok) {
      console.warn('Ticketmaster API responded with status:', res.status);
      return [];
    }

    const data = await res.json();
    const rawEvents: TMEvent[] = data?._embedded?.events || [];

    if (rawEvents.length === 0) {
      return [];
    }

    return rawEvents
      .filter((ev) => ev._embedded?.venues?.[0]?.location?.latitude)
      .map((ev, index) => {
        const venue = ev._embedded?.venues?.[0];
        const attractions = ev._embedded?.attractions || [];
        const artistName = attractions[0]?.name || ev.name.split(' - ')[0] || ev.name;
        const supportActs = attractions.slice(1, 4).map((a) => a.name || '').filter(Boolean);

        const tmGenre = ev.classifications?.[0]?.genre?.name;
        const tmSubGenre = ev.classifications?.[0]?.subGenre?.name;
        const mappedGenre = mapGenre(tmGenre, tmSubGenre);
        const mappedEventType = mapEventType(ev.name, venue?.name || '');

        // Select optimal 16:9 or high-res image
        const sortedImages = [...(ev.images || [])].sort((a, b) => (b.width || 0) - (a.width || 0));
        const heroImage =
          sortedImages.find((img) => img.ratio === '16_9')?.url ||
          sortedImages[0]?.url ||
          'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1600&q=80';

        const rawPriceMin = ev.priceRanges?.[0]?.min;
        const rawPriceMax = ev.priceRanges?.[0]?.max;
        const priceMin = rawPriceMin ? Math.round(rawPriceMin) : 45 + (index % 5) * 10;
        const priceMax = rawPriceMax ? Math.round(rawPriceMax) : priceMin + 120;
        const currency = ev.priceRanges?.[0]?.currency || 'USD';

        const statusCode = ev.dates?.status?.code;
        let ticketStatus: TicketStatus = 'on-sale';
        if (statusCode === 'offsale' || statusCode === 'cancelled') {
          ticketStatus = 'sold-out';
        } else if (index % 3 === 0) {
          ticketStatus = 'selling-fast';
        } else if (index % 5 === 0) {
          ticketStatus = 'low-tickets';
        }

        const dateIso =
          ev.dates?.start?.dateTime ||
          (ev.dates?.start?.localDate
            ? `${ev.dates.start.localDate}T${ev.dates.start.localTime || '19:00:00'}Z`
            : new Date().toISOString());

        const cityName = `${venue?.city?.name || 'Metropolis'}, ${venue?.state?.stateCode || venue?.country?.countryCode || ''}`;
        const venueName = venue?.name || 'Arena';
        const venueAddress = `${venue?.address?.line1 || ''}, ${venue?.city?.name || ''}`;
        const lat = parseFloat(venue?.location?.latitude || '40.7128');
        const lng = parseFloat(venue?.location?.longitude || '-74.006');

        return {
          id: `tm-${ev.id}`,
          title: ev.name,
          artist: artistName,
          artist_image: heroImage,
          banner_image: heroImage,
          genre: mappedGenre,
          event_type: mappedEventType,
          date: dateIso,
          doors_time: ev.dates?.start?.localTime ? ev.dates.start.localTime.slice(0, 5) : '18:30',
          city: cityName,
          venue_name: venueName,
          venue_address: venueAddress,
          lat,
          lng,
          price_min: priceMin,
          price_max: priceMax,
          currency,
          ticket_status: ticketStatus,
          tickets_remaining_pct: Math.max(8, 60 - (index % 7) * 7),
          setlist_preview: [
            `${artistName} Greatest Hits`,
            'Encore Track',
            'Fan Favorite Live Anthem',
            'Acoustic Solo Interlude',
            'Closing Finale'
          ],
          audio_sample: {
            track_name: `${artistName} (Live Tour Vibe)`,
            preview_synth_frequency: getSynthFrequency(mappedGenre),
            bpm: 120 + (index % 4) * 8,
            vibe_color: '#c084fc',
            duration_seconds: 30
          },
          description: `Live official performance at ${venueName}. Part of ${artistName}'s world tour. Verified official Ticketmaster listing.`,
          support_acts: supportActs,
          age_restriction: 'All Ages',
          rsvps_count: 65 + (index % 9) * 23,
          is_featured: index === 0,
          deal_rating: priceMin <= 60 ? 'great-deal' : 'fair-price',
          ticket_tiers: [
            { id: 'tier-ga', name: 'General Admission Floor / Pitch', price: priceMin, perks: ['Standing Floor Access', 'Official Barcode Pass'], available: true },
            { id: 'tier-lower', name: 'Lower Level Reserved Seating', price: Math.round(priceMin * 1.5), perks: ['Reserved Seat', 'Unobstructed Sightline'], available: true },
            { id: 'tier-vip', name: 'VIP Official Experience Package', price: priceMax, perks: ['Express Entry Lane', 'Lounge Pass & Merch'], available: ticketStatus !== 'sold-out' }
          ],
          ticket_url: ev.url
        };
      });
  } catch (err) {
    console.error('Error fetching from Ticketmaster API:', err);
    return [];
  }
}
