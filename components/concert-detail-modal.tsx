'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ConcertEvent, TicketTier } from '@/lib/types';
import { GENRE_METADATA, TICKET_STATUS_META } from '@/lib/constants';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Heart,
  Volume2,
  VolumeX,
  Check,
  Ticket,
  Users,
  Sparkles,
  Share2,
  CalendarPlus,
  Flame,
  CheckCircle2,
  ShieldCheck,
  Music
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateGoogleCalendarUrl, downloadIcsFile } from '@/lib/calendar';

interface ConcertDetailModalProps {
  concert: ConcertEvent;
  isSaved: boolean;
  onClose: () => void;
  onToggleSave: () => void;
  isPlayingAudio: boolean;
  onPlayAudio: (concert: ConcertEvent) => void;
  onOpenRsvp: (concert: ConcertEvent) => void;
  onShowToast: (msg: string) => void;
}

export default function ConcertDetailModal({
  concert,
  isSaved,
  onClose,
  onToggleSave,
  isPlayingAudio,
  onPlayAudio,
  onOpenRsvp,
  onShowToast
}: ConcertDetailModalProps) {
  const [selectedTier, setSelectedTier] = useState<TicketTier>(
    concert.ticket_tiers[0] || {
      id: 'default',
      name: 'General Admission',
      price: concert.price_min,
      perks: ['Full Stage View'],
      available: true
    }
  );
  const [quantity, setQuantity] = useState(1);
  const [ticketPurchased, setTicketPurchased] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const genreMeta = GENRE_METADATA[concert.genre] || GENRE_METADATA.all;
  const ticketMeta = TICKET_STATUS_META[concert.ticket_status];

  const eventDate = new Date(concert.date);
  const dateFormatted = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const handleBuyPass = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    setTicketPurchased(true);
    onShowToast(`🎉 Passes reserved for ${concert.artist}!`);
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      onShowToast('🔗 Tour link copied to clipboard!');
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 md:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full sm:max-w-3xl max-h-[95vh] sm:max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-[#0f111c] border border-stage-800 shadow-2xl text-slate-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle for mobile sheet */}
        <div className="sm:hidden flex justify-center pt-2 pb-1 sticky top-0 z-20 bg-[#0f111c]">
          <div className="w-10 h-1 rounded-full bg-stage-700" />
        </div>

        {/* Top Hero Visual */}
        <div className="relative h-48 sm:h-64 md:h-72 w-full shrink-0 bg-slate-950">
          <Image
            src={concert.banner_image || concert.artist_image}
            alt={concert.artist}
            fill
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, 800px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f111c] via-black/40 to-black/60" />

          {/* Top Controls */}
          <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold backdrop-blur-md border ${genreMeta.bgClass} ${genreMeta.borderClass}`}>
                {genreMeta.label}
              </span>
              <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold backdrop-blur-md border ${ticketMeta.badgeClass}`}>
                {ticketMeta.label}
              </span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Audio Vibe Preview Button */}
              <button
                onClick={() => onPlayAudio(concert)}
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full backdrop-blur-md border text-[10px] sm:text-xs font-bold transition-all active:scale-95 ${
                  isPlayingAudio
                    ? 'bg-cyan-500 text-black border-cyan-300 shadow-glow-cyan animate-pulse'
                    : 'bg-black/60 text-cyan-300 border-cyan-500/30 hover:bg-black/80'
                }`}
              >
                {isPlayingAudio ? <VolumeX className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <Volume2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                <span className="hidden sm:inline">{isPlayingAudio ? 'Pause Vibe' : 'Play Sound Preview'}</span>
              </button>

              <button
                onClick={handleShare}
                className="p-1.5 sm:p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white hover:bg-black/80"
                title="Share Tour Date"
              >
                {copiedLink ? <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              </button>

              <button
                onClick={onToggleSave}
                className="p-1.5 sm:p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white hover:bg-black/80"
                title="Save Show"
              >
                <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : 'text-slate-200'}`} />
              </button>

              <button
                onClick={onClose}
                className="p-1.5 sm:p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white hover:bg-black/80"
                title="Close"
              >
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>

          {/* Artist & Tour Titles */}
          <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 z-10">
            <h1 className="text-xl sm:text-2xl md:text-4xl font-black text-white tracking-tight leading-none mb-0.5 sm:mb-1">
              {concert.artist}
            </h1>
            <p className="text-xs sm:text-sm md:text-base font-semibold text-purple-400">
              {concert.title}
            </p>
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
          {/* Quick Date, Venue & Time Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-stage-900 border border-stage-800 text-xs">
            <div className="flex items-center gap-2 sm:gap-2.5">
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-purple-500/10 text-purple-400">
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-slate-400 block text-[10px] sm:text-[11px]">Show Date</span>
                <span className="font-bold text-white text-[11px] sm:text-xs truncate block">{dateFormatted}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-2.5">
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-cyan-500/10 text-cyan-400">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] sm:text-[11px]">Doors & Age</span>
                <span className="font-bold text-white text-[11px] sm:text-xs">Doors {concert.doors_time} • {concert.age_restriction}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-2.5">
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-emerald-500/10 text-emerald-400">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-slate-400 block text-[10px] sm:text-[11px]">Venue Location</span>
                <span className="font-bold text-white text-[11px] sm:text-xs truncate block">
                  {concert.venue_name} ({concert.city})
                </span>
              </div>
            </div>
          </div>

          {/* Description & Support Acts */}
          <div>
            <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 sm:mb-2">
              Tour Overview
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-2 sm:mb-3">
              {concert.description}
            </p>

            {concert.support_acts.length > 0 && (
              <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs text-slate-300">
                <span className="text-slate-500 font-semibold">Openers:</span>
                {concert.support_acts.map((act) => (
                  <span
                    key={act}
                    className="px-2 sm:px-2.5 py-0.5 rounded-lg bg-stage-900 border border-stage-800 text-purple-300 font-medium"
                  >
                    {act}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Setlist Anticipation Sneak Peek */}
          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-stage-900 border border-stage-800">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Music className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" />
                <h4 className="text-xs sm:text-sm font-bold text-white">Anticipated Setlist</h4>
              </div>
              <span className="text-[10px] sm:text-[11px] text-slate-400 hidden sm:inline">Based on recent tour stops</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 text-xs">
              {concert.setlist_preview.map((song, i) => (
                <div
                  key={song}
                  className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-stage-950/60 border border-stage-800/80"
                >
                  <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-purple-500/20 text-purple-300 font-bold text-[9px] sm:text-[10px] flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-slate-200 font-medium truncate text-[11px] sm:text-xs">{song}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ticket Selection & Digital Pass Simulator */}
          <div className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-gradient-to-b from-stage-900 to-stage-950 border border-stage-800 space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Ticket className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                <h4 className="text-xs sm:text-sm font-bold text-white">Select Ticket Category</h4>
              </div>
              <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-slate-400">
                <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" />
                <span>Verified Pricing</span>
              </div>
            </div>

            {/* Ticket Tier Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
              {concert.ticket_tiers.map((tier) => {
                const isSelected = selectedTier.id === tier.id;
                return (
                  <button
                    key={tier.id}
                    disabled={!tier.available}
                    onClick={() => {
                      setSelectedTier(tier);
                      setTicketPurchased(false);
                    }}
                    className={`p-3 sm:p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all active:scale-[0.98] ${
                      !tier.available
                        ? 'opacity-40 cursor-not-allowed border-stage-800 bg-stage-950'
                        : isSelected
                        ? 'border-emerald-500 bg-emerald-500/10 shadow-glow'
                        : 'border-stage-800 bg-stage-900 hover:border-stage-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-[11px] sm:text-xs text-white line-clamp-1">{tier.name}</span>
                        {isSelected && <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400 shrink-0" />}
                      </div>
                      <div className="text-sm sm:text-base font-extrabold text-emerald-400 mb-1.5 sm:mb-2">
                        ${tier.price}
                        <span className="text-[9px] sm:text-[10px] text-slate-400 font-normal"> /ea</span>
                      </div>
                    </div>
                    <ul className="text-[9px] sm:text-[10px] text-slate-400 space-y-0.5 sm:space-y-1">
                      {tier.perks.map((p, idx) => (
                        <li key={idx} className="flex items-center gap-1 truncate">
                          <span className="text-emerald-400">•</span> {p}
                        </li>
                      ))}
                    </ul>
                  </button>
                );
              })}
            </div>

            {/* Quantity & Buy Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-stage-800">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-[11px] sm:text-xs text-slate-400">Tickets:</span>
                <div className="flex items-center border border-stage-800 rounded-lg overflow-hidden bg-stage-950 text-xs">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      onClick={() => setQuantity(num)}
                      className={`px-2.5 sm:px-3 py-1 sm:py-1.5 font-bold transition-colors ${
                        quantity === num ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <span className="text-[11px] sm:text-xs text-slate-400">
                  Total: <strong className="text-white font-extrabold text-xs sm:text-sm">${selectedTier.price * quantity}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {concert.ticket_url && (
                  <a
                    href={concert.ticket_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-[11px] sm:text-xs shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95"
                    title="Open official Ticketmaster listing"
                  >
                    <span>Ticketmaster ↗</span>
                  </a>
                )}
                <button
                  onClick={handleBuyPass}
                  className="flex-1 sm:flex-none px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-white font-extrabold text-[11px] sm:text-xs shadow-lg transition-all active:scale-95 flex items-center justify-center gap-1.5 sm:gap-2"
                >
                  <Ticket className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>{ticketPurchased ? 'Confirmed ✓' : 'Reserve Pass'}</span>
                </button>
              </div>
            </div>

            {/* Simulated Digital Ticket Badge on Purchase */}
            {ticketPurchased && (
              <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 flex items-center justify-between gap-2 sm:gap-3 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-emerald-500 text-black font-black text-[10px] sm:text-xs shrink-0">
                    PASS
                  </div>
                  <div className="min-w-0">
                    <h5 className="font-extrabold text-white text-[11px] sm:text-xs truncate">
                      {quantity}x {selectedTier.name} Confirmed
                    </h5>
                    <p className="text-[10px] sm:text-[11px] text-emerald-400/80 truncate">
                      Barcode pass generated • Show ID at {concert.venue_name}
                    </p>
                  </div>
                </div>
                <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                  Active
                </span>
              </div>
            )}
          </div>

          {/* Squad RSVP & Calendar Sync Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-stage-900 border border-stage-800 text-xs">
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400 shrink-0" />
              <div>
                <span className="font-bold text-white block text-[11px] sm:text-xs">
                  {concert.rsvps_count} fans are attending
                </span>
                <span className="text-slate-400 text-[10px] sm:text-[11px]">
                  Join the attendee squad
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenRsvp(concert)}
                className="flex-1 sm:flex-none px-3 sm:px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all shadow-md active:scale-95 text-[11px] sm:text-xs text-center"
              >
                RSVP / Who&apos;s Going
              </button>

              {/* Add to Google Calendar */}
              <a
                href={generateGoogleCalendarUrl(concert)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-stage-950 border border-stage-800 text-slate-300 hover:text-white hover:border-stage-700 transition-all text-[11px] sm:text-xs"
                title="Add to Google Calendar"
              >
                <CalendarPlus className="w-3.5 h-3.5 text-purple-400" />
                <span className="hidden sm:inline">Google Cal</span>
              </a>

              {/* Download iCal */}
              <button
                onClick={() => downloadIcsFile(concert)}
                className="p-2 rounded-xl bg-stage-950 border border-stage-800 text-slate-300 hover:text-white hover:border-stage-700 transition-all"
                title="Download Apple / Outlook iCal (.ics)"
              >
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
