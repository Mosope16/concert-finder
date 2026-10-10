'use client';

import React from 'react';
import Image from 'next/image';
import { ConcertEvent } from '@/lib/types';
import { GENRE_METADATA, TICKET_STATUS_META } from '@/lib/constants';
import {
  Calendar,
  MapPin,
  Heart,
  Volume2,
  Users,
  ChevronRight,
  Flame
} from 'lucide-react';

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
      className={`card-virtualized group relative rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer border flex flex-col justify-between active:scale-[0.99] transition-[border-color,box-shadow] duration-200 ${
        isSelected
          ? 'bg-stage-900 border-purple-500 shadow-glow ring-2 ring-purple-500/30'
          : 'bg-stage-900/95 border-stage-800 hover:border-stage-700 hover:shadow-card'
      }`}
    >
      {/* Header Visual & Badges */}
      <div className="relative h-36 sm:h-44 md:h-48 w-full overflow-hidden bg-slate-950">
        <Image
          src={concert.banner_image || concert.artist_image}
          alt={concert.artist}
          fill
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover sm:group-hover:scale-105 transition-transform duration-500 will-change-transform"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stage-900 via-stage-900/30 to-black/60 pointer-events-none" />

        {/* Date Calendar Badge (Top Left) */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col items-center justify-center w-10 h-11 sm:w-12 sm:h-13 rounded-lg sm:rounded-xl bg-black/85 border border-white/15 text-center shadow-md">
          <span className="text-[9px] sm:text-[10px] font-black text-purple-400 tracking-wider">
            {monthStr}
          </span>
          <span className="text-sm sm:text-base font-extrabold text-white leading-none">
            {dayStr}
          </span>
          <span className="text-[8px] sm:text-[9px] text-slate-400 font-medium">
            {weekdayStr}
          </span>
        </div>

        {/* Top Right Actions: Audio Preview & Save */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex items-center gap-1 sm:gap-1.5 z-10">
          {/* Sound Preview Button */}
          <button
            onClick={(e) => onPlayAudio(e, concert)}
            className={`p-1.5 sm:p-2 rounded-full border transition-transform active:scale-90 ${
              isPlayingAudio
                ? 'bg-cyan-500 text-black border-cyan-300 shadow-glow-cyan'
                : 'bg-black/80 text-cyan-400 border-cyan-500/30 hover:bg-black'
            }`}
            title={isPlayingAudio ? 'Stop Sound Preview' : 'Play Live Synth Vibe'}
            aria-label="Play sound preview"
          >
            {isPlayingAudio ? (
              <div className="flex items-center gap-0.5 h-3 sm:h-3.5 px-0.5">
                <span className="w-0.5 h-3 bg-black animate-soundwave-1" />
                <span className="w-0.5 h-3 bg-black animate-soundwave-2" />
                <span className="w-0.5 h-3 bg-black animate-soundwave-3" />
              </div>
            ) : (
              <Volume2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            )}
          </button>

          {/* Bookmark Button */}
          <button
            onClick={(e) => onToggleSave(e, concert.id)}
            className="p-1.5 sm:p-2 rounded-full bg-black/80 border border-white/15 text-white hover:bg-black transition-transform active:scale-90"
            title={isSaved ? 'Remove from saved' : 'Save concert'}
            aria-label="Save concert"
          >
            <Heart className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isSaved ? 'fill-rose-500 text-rose-500' : 'text-slate-200'}`} />
          </button>
        </div>

        {/* Bottom Banner Info: Genre & Ticket Status */}
        <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3 flex items-center justify-between gap-1.5 sm:gap-2 pointer-events-none">
          <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
            <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold border shrink-0 bg-black/85 ${genreMeta.borderClass} ${genreMeta.bgClass.replace(/bg-[^ ]+/, '')}`}>
              {genreMeta.label}
            </span>
            {concert.deal_rating === 'great-deal' && (
              <span className="px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 bg-black/85 flex items-center gap-0.5 shrink-0">
                <Flame className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-amber-400" />
                <span className="hidden xs:inline">Great Value</span>
              </span>
            )}
          </div>

          {/* Ticket Status Pill */}
          <div className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold border flex items-center gap-1 sm:gap-1.5 shrink-0 bg-black/85 ${ticketMeta.badgeClass}`}>
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0 shadow-[0_0_6px_currentColor]"
              style={{ backgroundColor: ticketMeta.dotColor, color: ticketMeta.dotColor }}
            />
            <span>{ticketMeta.label}</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Artist Name & Tour Title */}
          <h3 className="font-extrabold text-sm sm:text-base text-white group-hover:text-purple-300 transition-colors line-clamp-1 mb-0.5">
            {concert.artist}
          </h3>
          <p className="text-[11px] sm:text-xs text-purple-400/90 font-medium line-clamp-1 mb-1.5 sm:mb-2">
            {concert.title}
          </p>

          {/* Venue & Location */}
          <div className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs text-slate-400 mb-1.5 sm:mb-2">
            <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-purple-400 shrink-0" />
            <span className="truncate">{concert.venue_name}</span>
            <span className="text-slate-600">•</span>
            <span className="truncate font-semibold text-slate-300">{concert.city}</span>
          </div>

          {/* Support Acts (if any) */}
          {concert.support_acts.length > 0 && (
            <p className="text-[10px] sm:text-[11px] text-slate-500 line-clamp-1 mb-2 sm:mb-3">
              With: {concert.support_acts.join(', ')}
            </p>
          )}
        </div>

        {/* Card Footer: Pricing, RSVP count & Action */}
        <div className="pt-2 sm:pt-3 border-t border-stage-800 flex items-center justify-between gap-2 mt-1 sm:mt-2">
          <div>
            <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-500 block leading-tight">
              Tickets From
            </span>
            <span className="text-sm sm:text-base font-extrabold text-emerald-400 leading-tight">
              ${concert.price_min}
              <span className="text-[10px] sm:text-xs text-slate-400 font-normal"> /ea</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="hidden xs:flex items-center gap-1 text-[10px] sm:text-[11px] text-slate-400" title="Fans RSVP'd">
              <Users className="w-3 h-3 text-purple-400" />
              <span>{concert.rsvps_count}</span>
            </div>

            <button
              onClick={() => onSelect(concert)}
              className="flex items-center gap-0.5 sm:gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-[11px] sm:text-xs font-bold transition-all shadow-md group-hover:shadow-glow active:scale-95"
            >
              <span>Explore</span>
              <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
