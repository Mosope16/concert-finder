import { ConcertEvent } from '../types';

export const INITIAL_CONCERTS: ConcertEvent[] = [
  {
    id: 'concert-weeknd-msg',
    title: 'After Hours Til Dawn World Tour',
    artist: 'The Weeknd',
    artist_image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    banner_image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1600&q=80',
    genre: 'pop',
    event_type: 'stadium-tour',
    date: '2026-10-24T19:30:00Z',
    doors_time: '18:00',
    city: 'New York, NY',
    venue_name: 'Madison Square Garden',
    venue_address: '4 Pennsylvania Plaza, New York, NY 10001',
    lat: 40.7505,
    lng: -73.9934,
    price_min: 78,
    price_max: 380,
    currency: 'USD',
    ticket_status: 'selling-fast',
    tickets_remaining_pct: 12,
    setlist_preview: [
      'Blinding Lights',
      'Starboy',
      'Save Your Tears',
      'Die For You',
      'The Hills',
      'Can’t Feel My Face'
    ],
    audio_sample: {
      track_name: 'Blinding Lights (Synth Vibe)',
      preview_synth_frequency: 349.23, // F4 80s synth
      bpm: 171,
      vibe_color: '#f43f5e',
      duration_seconds: 28
    },
    description: 'A cinematic high-voltage stadium spectacle featuring towering LED skylines, blinding lasers, and iconic synth-pop anthems. One night only in Manhattan.',
    support_acts: ['Kaytranada', 'Mike Dean'],
    age_restriction: 'All Ages',
    rsvps_count: 148,
    is_featured: true,
    deal_rating: 'great-deal',
    ticket_tiers: [
      { id: 'tier-ga-pit', name: 'General Admission Floor Pit', price: 145, perks: ['Standing Pit close to Stage', 'Early Entry Door 4', 'Collector Wristband'], available: true },
      { id: 'tier-lower', name: 'Lower Bowl Prime Seating', price: 210, perks: ['Unobstructed Sightlines', 'Padded Arena Seating', 'Dedicated Concessions'], available: true },
      { id: 'tier-vip', name: 'After Hours VIP Lounge Package', price: 380, perks: ['Priority Fast-Track Entry', 'Exclusive Tour Merch Pack', 'Lounge Open Bar pass'], available: false }
    ]
  },
  {
    id: 'concert-fred-mirage',
    title: 'Fred again.. & Friends Sunset to Dawn',
    artist: 'Fred again..',
    artist_image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
    banner_image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1600&q=80',
    genre: 'electronic',
    event_type: 'intimate-club',
    date: '2026-10-18T21:00:00Z',
    doors_time: '20:00',
    city: 'New York, NY',
    venue_name: 'The Brooklyn Mirage (Avant Gardner)',
    venue_address: '140 Stewart Ave, Brooklyn, NY 11237',
    lat: 40.7107,
    lng: -73.9267,
    price_min: 65,
    price_max: 180,
    currency: 'USD',
    ticket_status: 'low-tickets',
    tickets_remaining_pct: 6,
    setlist_preview: [
      'Delilah (pull me out of this)',
      'Danielle (smile on my face)',
      'Adore U',
      'Marea (we’ve lost dancing)',
      'Jungle',
      'Places To Be'
    ],
    audio_sample: {
      track_name: 'Delilah (Club Pulse)',
      preview_synth_frequency: 261.63, // C4
      bpm: 134,
      vibe_color: '#06b6d4',
      duration_seconds: 32
    },
    description: 'An emotional, energy-charged open-air marathon surrounded by Brooklyn Mirage’s 200-foot wrapping 15K video wall and KV2 3D sound system.',
    support_acts: ['Four Tet (Surprise Set)', 'Skrillex (B2B)'],
    age_restriction: '21+',
    rsvps_count: 220,
    is_featured: true,
    deal_rating: 'great-deal',
    ticket_tiers: [
      { id: 'tier-tier1', name: 'General Admission Early Bird', price: 65, perks: ['Full Open-Air Floor Access', 'Entry before 10 PM'], available: false },
      { id: 'tier-tier2', name: 'General Admission Anytime', price: 95, perks: ['Full Venue Access', 'Guaranteed Anytime Entry'], available: true },
      { id: 'tier-vip-deck', name: 'Mezzanine VIP Skydeck', price: 180, perks: ['Elevated Stage View', 'Private Restrooms', 'Express Bar Line'], available: true }
    ]
  },
  {
    id: 'concert-burna-sofi',
    title: 'I Told Them Stadium Experience',
    artist: 'Burna Boy',
    artist_image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    banner_image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=80',
    genre: 'afrobeats',
    event_type: 'stadium-tour',
    date: '2026-11-06T20:00:00Z',
    doors_time: '18:30',
    city: 'Los Angeles, CA',
    venue_name: 'SoFi Stadium',
    venue_address: '1001 Stadium Dr, Inglewood, CA 90301',
    lat: 33.9535,
    lng: -118.339,
    price_min: 52,
    price_max: 290,
    currency: 'USD',
    ticket_status: 'on-sale',
    tickets_remaining_pct: 38,
    setlist_preview: [
      'City Boys',
      'Last Last',
      'Tested, Approved & Trusted',
      'On The Low',
      'Ye',
      'Talibans II'
    ],
    audio_sample: {
      track_name: 'City Boys (Afro Groove)',
      preview_synth_frequency: 329.63, // E4
      bpm: 108,
      vibe_color: '#10b981',
      duration_seconds: 30
    },
    description: 'The African Giant brings full brass orchestras, mesmerizing choreography, and irresistible afro-fusion energy to Los Angeles for his largest US headline show yet.',
    support_acts: ['Seyi Vibez', 'DJ Spinall'],
    age_restriction: 'All Ages',
    rsvps_count: 175,
    is_featured: false,
    deal_rating: 'fair-price',
    ticket_tiers: [
      { id: 'tier-upper', name: 'Upper Concourse Seating', price: 52, perks: ['Full Stadium Atmosphere', 'Video Screen Views'], available: true },
      { id: 'tier-club', name: 'Verizon Club Level', price: 135, perks: ['Club Lounge Access', 'Premium Food & Beverage Options'], available: true },
      { id: 'tier-floor', name: 'Golden Circle Floor Standing', price: 290, perks: ['Front Row Stage Proximity', 'Exclusive Commemorative Laminate'], available: true }
    ]
  },
  {
    id: 'concert-arctic-forum',
    title: 'The Car International Tour Finale',
    artist: 'Arctic Monkeys',
    artist_image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=80',
    banner_image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1600&q=80',
    genre: 'rock-indie',
    event_type: 'arena',
    date: '2026-11-14T20:00:00Z',
    doors_time: '19:00',
    city: 'Los Angeles, CA',
    venue_name: 'Kia Forum',
    venue_address: '3900 W Manchester Blvd, Inglewood, CA 90305',
    lat: 33.9583,
    lng: -118.3419,
    price_min: 85,
    price_max: 275,
    currency: 'USD',
    ticket_status: 'selling-fast',
    tickets_remaining_pct: 18,
    setlist_preview: [
      'Do I Wanna Know?',
      '505',
      'R U Mine?',
      'Brianstorm',
      'There’d Better Be A Mirrorball',
      'Fluorescent Adolescent'
    ],
    audio_sample: {
      track_name: '505 (Indie Crunch)',
      preview_synth_frequency: 220.0, // A3
      bpm: 140,
      vibe_color: '#ef4444',
      duration_seconds: 25
    },
    description: 'Smooth crooning meets explosive garage rock riffs under the massive spinning disco ball at the legendary Forum. Expect intense guitar encores.',
    support_acts: ['Fontaines D.C.'],
    age_restriction: 'All Ages',
    rsvps_count: 94,
    is_featured: false,
    deal_rating: 'fair-price',
    ticket_tiers: [
      { id: 'tier-ga', name: 'Floor Standing Pit', price: 110, perks: ['Mosh & Singalong Proximity', 'First Come Floor Access'], available: true },
      { id: 'tier-seated', name: 'Lower Seating Section 110', price: 165, perks: ['Comfortable Forum Club Chairs', 'Central Audio Mix Point'], available: true }
    ]
  },
  {
    id: 'concert-kendrick-o2',
    title: 'The Grand Arena Tour: Double Bill',
    artist: 'Kendrick Lamar & SZA',
    artist_image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    banner_image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=1600&q=80',
    genre: 'hip-hop',
    event_type: 'arena',
    date: '2026-10-30T19:00:00Z',
    doors_time: '18:00',
    city: 'London, UK',
    venue_name: 'The O2 Arena',
    venue_address: 'Peninsula Square, London SE10 0DX',
    lat: 51.503,
    lng: 0.0032,
    price_min: 70,
    price_max: 310,
    currency: 'GBP',
    ticket_status: 'selling-fast',
    tickets_remaining_pct: 11,
    setlist_preview: [
      'Not Like Us',
      'Snooze',
      'DNA.',
      'All The Stars',
      'Kill Bill',
      'HUMBLE.'
    ],
    audio_sample: {
      track_name: 'Not Like Us (West Coast Knock)',
      preview_synth_frequency: 293.66, // D4
      bpm: 101,
      vibe_color: '#fbbf24',
      duration_seconds: 35
    },
    description: 'Two generational titans unite for a historic London weekend celebrating hip-hop storytelling, soul, and pure stage dominance.',
    support_acts: ['Baby Keem'],
    age_restriction: '16+ (Standing), All Ages (Seated)',
    rsvps_count: 310,
    is_featured: true,
    deal_rating: 'great-deal',
    ticket_tiers: [
      { id: 'tier-standing', name: 'O2 General Admission Standing', price: 95, perks: ['Arena Floor Pitch', 'Direct Stage View'], available: true },
      { id: 'tier-tier1-o2', name: 'Lower Tier Reserved Seating', price: 155, perks: ['Prime Sightlines', 'Easy Concession Access'], available: true },
      { id: 'tier-suite', name: 'VIP Diamond Hospitality Lounge', price: 310, perks: ['3-Course Pre-Show Dinner', 'Complimentary Champagne Bar', 'Luxury Box Seats'], available: false }
    ]
  },
  {
    id: 'concert-dua-wembley',
    title: 'Radical Optimism Summer Stadium Show',
    artist: 'Dua Lipa',
    artist_image: 'https://images.unsplash.com/photo-1520523839898-50712825d3a3?auto=format&fit=crop&w=1200&q=80',
    banner_image: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=1600&q=80',
    genre: 'pop',
    event_type: 'stadium-tour',
    date: '2026-11-02T19:30:00Z',
    doors_time: '17:30',
    city: 'London, UK',
    venue_name: 'Wembley Stadium',
    venue_address: 'London HA9 0WS, United Kingdom',
    lat: 51.556,
    lng: -0.2795,
    price_min: 58,
    price_max: 245,
    currency: 'GBP',
    ticket_status: 'on-sale',
    tickets_remaining_pct: 29,
    setlist_preview: [
      'Houdini',
      'Training Season',
      'Don’t Start Now',
      'Levitating',
      'Physical',
      'Illusion'
    ],
    audio_sample: {
      track_name: 'Houdini (Nu-Disco Pulse)',
      preview_synth_frequency: 392.0, // G4
      bpm: 117,
      vibe_color: '#f43f5e',
      duration_seconds: 30
    },
    description: 'Electrifying pop perfection with 40 dancers, dazzling pyro, and non-stop dance-pop hooks inside the United Kingdom’s cathedral of music.',
    support_acts: ['Tove Lo', 'Griff'],
    age_restriction: 'All Ages',
    rsvps_count: 185,
    is_featured: false,
    deal_rating: 'fair-price',
    ticket_tiers: [
      { id: 'tier-pitch', name: 'General Admission Pitch Standing', price: 78, perks: ['Pitch Access under Wembley Arch', 'Front Row Energy'], available: true },
      { id: 'tier-gold', name: 'Gold Circle Front Pitch', price: 140, perks: ['Dedicated Runway View', 'Fast Track Entrance B'], available: true }
    ]
  },
  {
    id: 'concert-peggy-sonar',
    title: 'Sonar Night: Industrial Echoes',
    artist: 'Peggy Gou & Bicep',
    artist_image: 'https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?auto=format&fit=crop&w=1200&q=80',
    banner_image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1600&q=80',
    genre: 'electronic',
    event_type: 'festival',
    date: '2026-10-31T22:00:00Z',
    doors_time: '21:00',
    city: 'Berlin, DE',
    venue_name: 'Kraftwerk Berlin',
    venue_address: 'Köpenicker Str. 70, 10179 Berlin',
    lat: 52.5113,
    lng: 13.4194,
    price_min: 45,
    price_max: 95,
    currency: 'EUR',
    ticket_status: 'low-tickets',
    tickets_remaining_pct: 8,
    setlist_preview: [
      '(It Goes Like) Nanana',
      'Glue',
      'I Believe in Love Again',
      'Apricots',
      'Starry Night',
      'Atlas'
    ],
    audio_sample: {
      track_name: 'Nanana (Berlin Acid Arp)',
      preview_synth_frequency: 440.0, // A4
      bpm: 130,
      vibe_color: '#06b6d4',
      duration_seconds: 30
    },
    description: 'Raw concrete cathedral architecture meets boundary-pushing audio-visual synthesis. Bicep presents Chroma AV LIVE followed by Peggy Gou’s iconic euphoric house set.',
    support_acts: ['Avalon Emerson', 'HAAi'],
    age_restriction: '18+',
    rsvps_count: 240,
    is_featured: true,
    deal_rating: 'great-deal',
    ticket_tiers: [
      { id: 'tier-full-night', name: 'All Night Pass (10PM - 8AM)', price: 55, perks: ['Access to Turbine Hall & Basement', 'Cloakroom included'], available: true }
    ]
  },
  {
    id: 'concert-asake-rema',
    title: 'Lagos Island Beach Live Countdown',
    artist: 'Asake & Rema',
    artist_image: 'https://images.unsplash.com/photo-1520523882741-425bdaf5079f?auto=format&fit=crop&w=1200&q=80',
    banner_image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=80',
    genre: 'afrobeats',
    event_type: 'festival',
    date: '2026-11-20T18:00:00Z',
    doors_time: '16:00',
    city: 'Lagos, NG',
    venue_name: 'Landmark Beach Arena',
    venue_address: 'Water Corporation Dr, Oniru, Victoria Island, Lagos',
    lat: 6.4253,
    lng: 3.4419,
    price_min: 30,
    price_max: 200,
    currency: 'USD',
    ticket_status: 'selling-fast',
    tickets_remaining_pct: 15,
    setlist_preview: [
      'Lonely At The Top',
      'Calm Down',
      'MMS',
      'Amapiano',
      'Benin Boys',
      'Organise'
    ],
    audio_sample: {
      track_name: 'Lonely At The Top (Log Drum Vibe)',
      preview_synth_frequency: 246.94, // B3
      bpm: 112,
      vibe_color: '#10b981',
      duration_seconds: 32
    },
    description: 'The premier coastal celebration in West Africa. Ocean breeze, heavy Amapiano log drums, Fuji harmonies, and superstar guest appearances until sunrise.',
    support_acts: ['Shallipopi', 'Victony', 'DJ Tunez'],
    age_restriction: 'All Ages',
    rsvps_count: 280,
    is_featured: true,
    deal_rating: 'great-deal',
    ticket_tiers: [
      { id: 'tier-beach-ga', name: 'Beach General Access', price: 35, perks: ['Beachfront Sand Access', 'Live Stage Zone'], available: true },
      { id: 'tier-cabana', name: 'VIP Oceanside Cabana Seat', price: 180, perks: ['Elevated Wooden Deck', 'Complimentary Drinks Bucket', 'Security Escort'], available: true }
    ]
  },
  {
    id: 'concert-foo-chicago',
    title: 'Everything or Nothing at All Tour',
    artist: 'Foo Fighters',
    artist_image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    banner_image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1600&q=80',
    genre: 'metal',
    event_type: 'arena',
    date: '2026-11-09T19:30:00Z',
    doors_time: '18:00',
    city: 'Chicago, IL',
    venue_name: 'United Center',
    venue_address: '1901 W Madison St, Chicago, IL 60612',
    lat: 41.8807,
    lng: -87.6742,
    price_min: 75,
    price_max: 260,
    currency: 'USD',
    ticket_status: 'selling-fast',
    tickets_remaining_pct: 14,
    setlist_preview: [
      'Everlong',
      'The Pretender',
      'Best of You',
      'Learn to Fly',
      'All My Life',
      'Rescued'
    ],
    audio_sample: {
      track_name: 'Everlong (Rock Anthem Drive)',
      preview_synth_frequency: 293.66, // D4
      bpm: 158,
      vibe_color: '#94a3b8',
      duration_seconds: 28
    },
    description: 'Three hours of relentless, unadulterated rock ‘n’ roll from Dave Grohl and the Foo Fighters. High-powered guitars, anthemic singalongs, and pyrotechnics.',
    support_acts: ['The Hives', 'Amyl and The Sniffers'],
    age_restriction: 'All Ages',
    rsvps_count: 122,
    is_featured: false,
    deal_rating: 'fair-price',
    ticket_tiers: [
      { id: 'tier-pit-uc', name: 'General Admission Floor Pit', price: 125, perks: ['Standing Pit by Center Runway'], available: true },
      { id: 'tier-bowl-uc', name: '100 Level Premium Reserved', price: 185, perks: ['Padded Arena Seating', 'Direct Line to Soundboard'], available: true }
    ]
  },
  {
    id: 'concert-khruangbin-austin',
    title: 'Texas Moon Sunset Series',
    artist: 'Khruangbin & Leon Bridges',
    artist_image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    banner_image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1600&q=80',
    genre: 'jazz-soul',
    event_type: 'amphitheater',
    date: '2026-10-21T18:30:00Z',
    doors_time: '17:00',
    city: 'Austin, TX',
    venue_name: 'Moody Amphitheater at Waterloo Park',
    venue_address: '1401 Trinity St, Austin, TX 78701',
    lat: 30.2762,
    lng: -97.7344,
    price_min: 49,
    price_max: 165,
    currency: 'USD',
    ticket_status: 'on-sale',
    tickets_remaining_pct: 32,
    setlist_preview: [
      'Texas Sun',
      'Time (You and I)',
      'Mariella',
      'So We Won’t Forget',
      'B-Side',
      'White Gloves'
    ],
    audio_sample: {
      track_name: 'Texas Sun (Desert Groove)',
      preview_synth_frequency: 329.63, // E4
      bpm: 98,
      vibe_color: '#d97706',
      duration_seconds: 30
    },
    description: 'Groovy psychedelic soul beneath the Austin skyline as dusk settles over Waterloo Park. Warm vintage reverb, silky vocals, and laid-back vibes.',
    support_acts: ['Hermanos Gutiérrez'],
    age_restriction: 'All Ages',
    rsvps_count: 140,
    is_featured: false,
    deal_rating: 'great-deal',
    ticket_tiers: [
      { id: 'tier-lawn', name: 'Open Lawn Seating (Bring Blanket)', price: 49, perks: ['Grassy Hill with Skyline Backdrop', 'Chill Sunset Atmosphere'], available: true },
      { id: 'tier-reserved-moody', name: 'Reserved Orchestra Rows A-K', price: 110, perks: ['Covered Front Stage Seating', 'Acoustic Sweet Spot'], available: true }
    ]
  }
];
