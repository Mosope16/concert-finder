'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ConcertEvent } from '@/lib/types';
import { GENRE_METADATA, TICKET_STATUS_META } from '@/lib/constants';
import {
  Calendar,
  MapPin,
  Heart,
  Volume2,
  VolumeX,
  Users,
  Sparkles,
  Ticket,
  ChevronRight,
  Flame
} from 'lucide-react';
import { soundEngine } from '@/lib/audio';

interface ConcertCardProps {
  concert: ConcertEvent;
  isSelected: boolean;
  isSaved: boolean;
  priority?: boolean;
  isPlayingAudio: boolean;
  onSelect: (concert: ConcertEvent) => void;
  onToggleSave: (e: React.MouseEvent, concertId: string) => void;
  onPlayAudio: (e: React.MouseEvent, concert: ConcertEvent) => void;
  onFocusOnMap?: (e: React.MouseEvent, concert: ConcertEvent) => void;
}

export default function ConcertCard({
  concert,
  isSelected,
  isSaved,
  priority = false,
  isPlayingAudio,
  onSelect,
  onToggleSave,
  onPlayAudio,
  onFocusOnMap
}: ConcertCardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const genreMeta = GENRE_METADATA[concert.genre] || GENRE_METADATA.all;
  const ticketMeta = TICKET_STATUS_META[concert.ticket_status];

  // Parse date
  const eventDate = new Date(concert.date);
  const monthStr = eventDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const dayStr = eventDate.toLocaleDateString('en-US', { day: 'numeric' });
  const weekdayStr = eventDate.toLocaleDateString('en-US', { weekday: 'short' });

  return (
    <div
      onClick={() => onSelect(concert)}
      className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border flex flex-col justify-between ${
        isSelected
          ? 'bg-stage-900 border-purple-500 shadow-glow ring-2 ring-purple-500/30'
          : 'bg-stage-900/90 border-stage-800 hover:border-stage-700 hover:shadow-card hover:-translate-y-0.5'
      }`}
    >
      {/* Header Visual & Badges */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-950">
        <Image
          src={concert.banner_image || concert.artist_image}
          alt={concert.artist}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stage-900 via-stage-900/30 to-black/60" />

        {/* Date Calendar Badge (Top Left) */}
        <div className="absolute top-3 left-3 flex flex-col items-center justify-center w-12 h-13 rounded-xl bg-black/70 backdrop-blur-md border border-white/15 text-center shadow-lg">
          <span className="text-[10px] font-black text-purple-400 tracking-wider">
            {monthStr}
          </span>
          <span className="text-base font-extrabold text-white leading-none">
            {dayStr}
          </span>
          <span className="text-[9px] text-slate-400 font-medium">
            {weekdayStr}
          </span>
        </div>

        {/* Top Right Actions: Audio Preview & Save */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          {/* Sound Preview Button */}
          <button
            onClick={(e) => onPlayAudio(e, concert)}
            className={`p-2 rounded-full backdrop-blur-md border transition-all active:scale-90 ${
              isPlayingAudio
                ? 'bg-cyan-500 text-black border-cyan-300 shadow-glow-cyan animate-pulse'
                : 'bg-black/60 text-cyan-400 border-cyan-500/30 hover:bg-black/80'
            }`}
            title={isPlayingAudio ? 'Stop Sound Preview' : 'Play Live Synth Vibe'}
          >
            {isPlayingAudio ? (
              <div className="flex items-center gap-0.5 h-3.5 px-0.5">
                <span className="w-0.5 bg-black animate-soundwave-1" />
                <span className="w-0.5 bg-black animate-soundwave-2" />
                <span className="w-0.5 bg-black animate-soundwave-3" />
              </div>
            ) : (
              <Volume2 className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Bookmark Button */}
          <button
            onClick={(e) => onToggleSave(e, concert.id)}
            className="p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white hover:bg-black/80 transition-all active:scale-90"
            title={isSaved ? 'Remove from saved' : 'Save concert'}
          >
            <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-rose-500 text-rose-500' : 'text-slate-200'}`} />
          </button>
        </div>

        {/* Bottom Banner Info: Genre & Ticket Status */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border backdrop-blur-md ${genreMeta.bgClass} ${genreMeta.borderClass}`}>
              {genreMeta.label}
            </span>
            {concert.deal_rating === 'great-deal' && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-md flex items-center gap-1">
                <Flame className="w-2.5 h-2.5 text-amber-400" />
                Great Value
              </span>
            )}
          </div>

          {/* Ticket Status Pill */}
          <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold border backdrop-blur-md flex items-center gap-1.5 ${ticketMeta.badgeClass}`}>
            <span
              className="w-1.5 h-1.5 rounded-full animate-ping"
              style={{ backgroundColor: ticketMeta.dotColor }}
            />
            <span>{ticketMeta.label}</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Artist Name & Tour Title */}
          <h3 className="font-extrabold text-base text-white group-hover:text-purple-300 transition-colors line-clamp-1 mb-0.5">
            {concert.artist}
          </h3>
          <p className="text-xs text-purple-400/90 font-medium line-clamp-1 mb-2">
            {concert.title}
          </p>

          {/* Venue & Location */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
            <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span className="truncate">{concert.venue_name}</span>
            <span className="text-slate-600">•</span>
            <span className="truncate font-semibold text-slate-300">{concert.city}</span>
          </div>

          {/* Support Acts (if any) */}
          {concert.support_acts.length > 0 && (
            <p className="text-[11px] text-slate-500 line-clamp-1 mb-3">
              With: {concert.support_acts.join(', ')}
            </p>
          )}
        </div>

        {/* Card Footer: Pricing, RSVP count & Action */}
        <div className="pt-3 border-t border-stage-800 flex items-center justify-between gap-2 mt-2">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-500 block leading-tight">
              Tickets From
            </span>
            <span className="text-base font-extrabold text-emerald-400 leading-tight">
              ${concert.price_min}
              <span className="text-xs text-slate-400 font-normal"> /ea</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-[11px] text-slate-400" title="Students & Fans RSVP'd">
              <Users className="w-3 h-3 text-purple-400" />
              <span>{concert.rsvps_count}</span>
            </div>

            <button
              onClick={() => onSelect(concert)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md group-hover:shadow-glow"
            >
              <span>Explore</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
