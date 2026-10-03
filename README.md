# 🎸 Project #4: Concert Finder — Live Tour Radar & Festival Guide

A high-energy, dark-mode concert discovery and tour tracking web platform built for music fans, festival-goers, and live show enthusiasts.

Part of the **Project Series** by Mosopefoluwa.

---

## 🌟 Key Features

### 1. 🗺️ Interactive Live Venue Radar (Leaflet + OpenStreetMap)
- **100% Free & No API Keys Required**: Uses OpenStreetMap Humanitarian tiles with zero watermarks and no payment card needed.
- **Neon Stage Beacons**: Color-coded pins for each venue stage matching the artist's genre and crowd ticket availability status.
- **City Quick Selector**: Instantly pan and zoom into New York, Los Angeles, London, Berlin, Lagos, Austin, and Chicago.

### 2. 🎵 Web Audio Live Synth Previews
- Built-in Web Audio API synthesizer that plays atmospheric musical chord progressions and synth hooks matching each headline tour stop's key and BPM without copyright or broken external MP3 links.
- Floating bottom-corner mini-player with animated real-time soundwave equalizer.

### 3. 🎟️ Ticket Tiers & Digital Pass Generator
- Dynamic ticket tier selection (General Admission Pit, Lower Bowl Reserved, VIP Skydeck).
- Quantity picker, real-time total pricing calculation, and 1-click **Pass Reservation Simulator** with celebratory confetti animation.

### 4. 📅 1-Click Calendar Export (.ics & Google Calendar)
- Add any upcoming concert directly to your **Google Calendar** or download a universal **iCal (.ics)** invite compatible with Apple Calendar, Outlook, and mobile devices.

### 5. 👥 Squad RSVP Planner
- Register attendance ("Definitely Going" vs "Interested / Looking for Squad").
- Live attendee counter and recent fan RSVP list for coordinating show meetups.

### 6. ✨ "Match My Vibe" 3-Step Concert Matcher
- 3-step interactive quiz based on night energy, musical mood, and ticket budget to find your ultimate live tour match.

### 7. 🗄️ Shared Supabase Database Integration
- Full offline-first LocalStorage fallback with pre-seeded tours.
- Namespaced database migration script in [`supabase/schema.sql`](supabase/schema.sql) with tables `concert_events`, `concert_rsvps`, and `concert_saved_shows` so it can be executed safely inside your shared Supabase project without conflicting with other projects in the series.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router + Turbopack)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS (Dark Stage & Neon Palette)
- **Icons**: Lucide React
- **Mapping**: Leaflet + OpenStreetMap
- **Effects**: Canvas Confetti
- **Backend / Database**: Supabase (PostgreSQL + RLS) + LocalStorage offline sync
- **Audio Engine**: Web Audio API Sound Synthesizer

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
npm run start
```
