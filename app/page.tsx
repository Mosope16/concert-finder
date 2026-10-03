'use client';

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { ConcertEvent, FilterState, GenreCategory } from '@/lib/types';
import { INITIAL_CONCERTS } from '@/lib/data/seed-concerts';
import {
  getStoredConcerts,
  getSavedConcertIds,
  toggleSavedConcert
} from '@/lib/storage';
import { soundEngine } from '@/lib/audio';

import Navbar from '@/components/navbar';
import FiltersBar from '@/components/filters-bar';
import ConcertCard from '@/components/concert-card';
import ConcertDetailModal from '@/components/concert-detail-modal';
import VibeQuizModal from '@/components/vibe-quiz-modal';
import SquadRsvpModal from '@/components/squad-rsvp-modal';
import AudioPreviewPlayer from '@/components/audio-preview-player';

import {
  Sparkles,
  Flame,
  Radio,
  MapPin,
  Calendar,
  Ticket,
  ChevronRight,
  FilterX,
  Volume2,
  Users
} from 'lucide-react';

const VenueMap = dynamic(() => import('@/components/map/venue-map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[380px] rounded-3xl bg-stage-950 flex flex-col items-center justify-center text-slate-400 text-xs gap-3 border border-stage-800">
      <div className="w-6 h-6 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
      <span>Loading Interactive Venue Radar...</span>
    </div>
  )
});

export default function ConcertDashboard() {
  const [concerts, setConcerts] = useState<ConcertEvent[]>(INITIAL_CONCERTS);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [selectedConcertId, setSelectedConcertId] = useState<string | null>(
    INITIAL_CONCERTS[0]?.id || null
  );
  const [selectedCity, setSelectedCity] = useState('all');
  const [showOnlySaved, setShowOnlySaved] = useState(false);
  const [layoutMode, setLayoutMode] = useState<'split' | 'grid' | 'map'>('split');

  // Modals & Extras
  const [activeModal, setActiveModal] = useState<'detail' | 'quiz' | 'rsvp' | null>(null);
  const [modalTargetConcert, setModalTargetConcert] = useState<ConcertEvent | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Audio Engine State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentAudioTrack, setCurrentAudioTrack] = useState<string | null>(null);
  const [currentAudioArtist, setCurrentAudioArtist] = useState<string | undefined>(undefined);

  // Hydration sync
  useEffect(() => {
    setConcerts(getStoredConcerts());
    setSavedIds(getSavedConcertIds());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    city: 'all',
    genre: 'all',
    eventType: 'all',
    ticketStatus: 'all',
    maxPrice: 500,
    timeRange: 'all',
    sortBy: 'date'
  });

  const handleFilterUpdate = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    handleFilterUpdate({ city });
  };

  // Sound Engine handler
  const handlePlayAudio = (e: React.MouseEvent | null, concert: ConcertEvent) => {
    if (e) e.stopPropagation();

    if (isPlayingAudio && currentAudioTrack === concert.audio_sample.track_name) {
      soundEngine.stop();
      setIsPlayingAudio(false);
      setCurrentAudioTrack(null);
      setCurrentAudioArtist(undefined);
    } else {
      soundEngine.playConcertVibe(
        concert.audio_sample.preview_synth_frequency || 330,
        concert.audio_sample.bpm || 120,
        concert.audio_sample.track_name,
        () => {
          setIsPlayingAudio(false);
          setCurrentAudioTrack(null);
        }
      );
      setIsPlayingAudio(true);
      setCurrentAudioTrack(concert.audio_sample.track_name);
      setCurrentAudioArtist(concert.artist);
      showToast(`🎵 Playing synth vibe preview for ${concert.artist}`);
    }
  };

  const handleStopAudio = () => {
    soundEngine.stop();
    setIsPlayingAudio(false);
    setCurrentAudioTrack(null);
    setCurrentAudioArtist(undefined);
  };

  // Toggle Save / Bookmark
  const handleToggleSave = (e: React.MouseEvent | null, concertId: string) => {
    if (e) e.stopPropagation();
    const updated = toggleSavedConcert(concertId);
    setSavedIds(updated);
    const isNowSaved = updated.includes(concertId);
    showToast(isNowSaved ? '❤️ Concert added to your saved tour dates!' : 'Removed from saved shows.');
  };

  // Select Concert
  const handleSelectConcert = (concert: ConcertEvent) => {
    setSelectedConcertId(concert.id);
    setModalTargetConcert(concert);
    setActiveModal('detail');
  };

  // Filter Logic
  const filteredConcerts = useMemo(() => {
    let result = [...concerts];

    // Saved only filter
    if (showOnlySaved) {
      result = result.filter((c) => savedIds.includes(c.id));
    }

    // City filter
    if (selectedCity !== 'all') {
      result = result.filter((c) => c.city === selectedCity);
    }

    // Genre filter
    if (filters.genre !== 'all') {
      result = result.filter((c) => c.genre === filters.genre);
    }

    // Event format filter
    if (filters.eventType !== 'all') {
      result = result.filter((c) => c.event_type === filters.eventType);
    }

    // Available tickets filter
    if (filters.ticketStatus === 'available-only') {
      result = result.filter((c) => c.ticket_status !== 'sold-out');
    }

    // Search query
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.artist.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.venue_name.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q) ||
          c.support_acts.some((act) => act.toLowerCase().includes(q))
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (filters.sortBy === 'price-low') return a.price_min - b.price_min;
      if (filters.sortBy === 'price-high') return b.price_min - a.price_min;
      if (filters.sortBy === 'popularity') return b.rsvps_count - a.rsvps_count;
      // Default: date upcoming
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    return result;
  }, [concerts, savedIds, showOnlySaved, selectedCity, filters]);

  // Featured Spotlight Concert
  const spotlightConcert = useMemo(() => {
    return concerts.find((c) => c.is_featured) || concerts[0];
  }, [concerts]);

  return (
    <div className="min-h-screen bg-[#090a10] text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        selectedCity={selectedCity}
        onCityChange={handleCitySelect}
        searchQuery={filters.searchQuery}
        onSearchChange={(q) => handleFilterUpdate({ searchQuery: q })}
        savedCount={savedIds.length}
        showOnlySaved={showOnlySaved}
        onToggleSavedOnly={() => setShowOnlySaved((prev) => !prev)}
        onOpenQuiz={() => setActiveModal('quiz')}
        isPlayingAudio={isPlayingAudio}
        currentAudioTrack={currentAudioTrack}
        onStopAudio={handleStopAudio}
      />

      {/* Hero Tour Spotlight Banner */}
      {spotlightConcert && !showOnlySaved && !filters.searchQuery && (
        <section className="relative w-full border-b border-stage-800 bg-gradient-to-b from-[#131524] to-[#090a10] overflow-hidden py-8 px-4 sm:px-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(192,132,252,0.15),transparent_50%)] pointer-events-none" />
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 max-w-xl text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-purple-500/20 text-purple-300 border border-purple-500/30">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Featured Global Headline Stop</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                {spotlightConcert.artist}
              </h2>
              <p className="text-sm sm:text-base font-semibold text-purple-300">
                {spotlightConcert.title} • {spotlightConcert.venue_name} ({spotlightConcert.city})
              </p>
              <p className="text-xs text-slate-400 line-clamp-2">
                {spotlightConcert.description}
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                <button
                  onClick={() => handleSelectConcert(spotlightConcert)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-extrabold text-xs shadow-glow hover:brightness-110 transition-all active:scale-95 flex items-center gap-2"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Get Official Passes (From ${spotlightConcert.price_min})</span>
                </button>

                <button
                  onClick={(e) => handlePlayAudio(e, spotlightConcert)}
                  className="px-4 py-2.5 rounded-xl bg-stage-900 border border-stage-800 hover:border-cyan-500 text-cyan-400 font-bold text-xs transition-all flex items-center gap-2"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Preview Audio Vibe</span>
                </button>
              </div>
            </div>

            {/* Quick Stats Pill Cards */}
            <div className="grid grid-cols-2 gap-3 w-full md:w-auto shrink-0 text-xs">
              <div className="p-4 rounded-2xl bg-stage-900/80 border border-stage-800 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Tickets Left</span>
                <span className="text-xl font-black text-rose-400">{spotlightConcert.tickets_remaining_pct}%</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Selling Fast</span>
              </div>
              <div className="p-4 rounded-2xl bg-stage-900/80 border border-stage-800 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Fans Going</span>
                <span className="text-xl font-black text-purple-400">{spotlightConcert.rsvps_count}</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Squad RSVPs</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Filter and Control Bar */}
      <FiltersBar
        filters={filters}
        onFilterChange={handleFilterUpdate}
        layoutMode={layoutMode}
        onLayoutChange={setLayoutMode}
        totalResultsCount={filteredConcerts.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-lg text-white">
              {showOnlySaved ? 'Your Saved Concerts' : 'Upcoming Live Tour Dates'}
            </h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-stage-800 text-purple-300 border border-stage-700">
              {filteredConcerts.length} Shows
            </span>
          </div>

          {showOnlySaved && (
            <button
              onClick={() => setShowOnlySaved(false)}
              className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
            >
              ← Back to All Tour Dates
            </button>
          )}
        </div>

        {/* Content Layout Modes */}
        {layoutMode === 'split' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Concerts List */}
            <div className="lg:col-span-7 xl:col-span-6 space-y-4">
              {filteredConcerts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredConcerts.map((concert, index) => (
                    <ConcertCard
                      key={concert.id}
                      concert={concert}
                      priority={index < 2}
                      isSelected={selectedConcertId === concert.id}
                      isSaved={savedIds.includes(concert.id)}
                      isPlayingAudio={isPlayingAudio && currentAudioTrack === concert.audio_sample.track_name}
                      onSelect={handleSelectConcert}
                      onToggleSave={handleToggleSave}
                      onPlayAudio={handlePlayAudio}
                      onFocusOnMap={(e) => {
                        e.stopPropagation();
                        setSelectedConcertId(concert.id);
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-stage-800 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-purple-500/10 text-purple-400 mx-auto flex items-center justify-center">
                    <FilterX className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-white text-base">No tour dates found</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Try clearing genre filters or selecting &ldquo;All Cities&rdquo; to explore more upcoming concerts.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCity('all');
                      setFilters({
                        searchQuery: '',
                        city: 'all',
                        genre: 'all',
                        eventType: 'all',
                        ticketStatus: 'all',
                        maxPrice: 500,
                        timeRange: 'all',
                        sortBy: 'date'
                      });
                      setShowOnlySaved(false);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 text-white shadow-md"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>

            {/* Right Column: Sticky Interactive Venue Radar Map */}
            <div className="lg:col-span-5 xl:col-span-6 lg:sticky lg:top-24 h-[420px] lg:h-[calc(100vh-140px)]">
              <VenueMap
                concerts={filteredConcerts}
                selectedConcertId={selectedConcertId}
                onSelectConcert={handleSelectConcert}
                selectedCity={selectedCity}
              />
            </div>
          </div>
        )}

        {layoutMode === 'grid' && (
          <div>
            {filteredConcerts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredConcerts.map((concert, index) => (
                  <ConcertCard
                    key={concert.id}
                    concert={concert}
                    priority={index < 4}
                    isSelected={selectedConcertId === concert.id}
                    isSaved={savedIds.includes(concert.id)}
                    isPlayingAudio={isPlayingAudio && currentAudioTrack === concert.audio_sample.track_name}
                    onSelect={handleSelectConcert}
                    onToggleSave={handleToggleSave}
                    onPlayAudio={handlePlayAudio}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 px-4 rounded-3xl border border-dashed border-stage-800 space-y-3">
                <h4 className="font-bold text-white text-base">No matching concerts</h4>
                <p className="text-xs text-slate-400">Try adjusting your filters.</p>
              </div>
            )}
          </div>
        )}

        {layoutMode === 'map' && (
          <div className="w-full h-[calc(100vh-180px)] min-h-[500px]">
            <VenueMap
              concerts={filteredConcerts}
              selectedConcertId={selectedConcertId}
              onSelectConcert={handleSelectConcert}
              selectedCity={selectedCity}
            />
          </div>
        )}
      </main>

      {/* Floating Audio Preview Player */}
      <AudioPreviewPlayer
        isPlaying={isPlayingAudio}
        trackName={currentAudioTrack}
        artistName={currentAudioArtist}
        onStop={handleStopAudio}
      />

      {/* Modals */}
      {activeModal === 'detail' && modalTargetConcert && (
        <ConcertDetailModal
          concert={modalTargetConcert}
          isSaved={savedIds.includes(modalTargetConcert.id)}
          onClose={() => setActiveModal(null)}
          onToggleSave={() => handleToggleSave(null, modalTargetConcert.id)}
          isPlayingAudio={isPlayingAudio && currentAudioTrack === modalTargetConcert.audio_sample.track_name}
          onPlayAudio={(c) => handlePlayAudio(null, c)}
          onOpenRsvp={(c) => {
            setModalTargetConcert(c);
            setActiveModal('rsvp');
          }}
          onShowToast={showToast}
        />
      )}

      {activeModal === 'quiz' && (
        <VibeQuizModal
          concerts={concerts}
          onClose={() => setActiveModal(null)}
          onSelectConcert={(c) => {
            setSelectedConcertId(c.id);
            setModalTargetConcert(c);
            setActiveModal('detail');
          }}
        />
      )}

      {activeModal === 'rsvp' && modalTargetConcert && (
        <SquadRsvpModal
          concert={modalTargetConcert}
          onClose={() => setActiveModal(null)}
          onRsvpSuccess={(updated) => {
            setConcerts((prev) =>
              prev.map((c) => (c.id === updated.id ? updated : c))
            );
            setModalTargetConcert(updated);
            showToast(`🎉 RSVP registered for ${updated.artist}!`);
          }}
        />
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-stage-900/95 border border-purple-500/50 shadow-glow text-white text-xs font-semibold backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 duration-200">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
