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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#0f111c] border border-stage-800 shadow-2xl text-slate-100 flex flex-col">
        {/* Top Hero Visual */}
        <div className="relative h-64 sm:h-72 w-full shrink-0 bg-slate-950">
          <Image
            src={concert.banner_image || concert.artist_image}
            alt={concert.artist}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f111c] via-black/40 to-black/60" />

          {/* Top Controls */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md border ${genreMeta.bgClass} ${genreMeta.borderClass}`}>
                {genreMeta.label}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md border ${ticketMeta.badgeClass}`}>
                {ticketMeta.label}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Audio Vibe Preview Button */}
              <button
                onClick={() => onPlayAudio(concert)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md border text-xs font-bold transition-all active:scale-95 ${
                  isPlayingAudio
                    ? 'bg-cyan-500 text-black border-cyan-300 shadow-glow-cyan animate-pulse'
                    : 'bg-black/60 text-cyan-300 border-cyan-500/30 hover:bg-black/80'
                }`}
              >
                {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span>{isPlayingAudio ? 'Pause Vibe' : 'Play Sound Preview'}</span>
              </button>

              <button
                onClick={handleShare}
                className="p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white hover:bg-black/80"
                title="Share Tour Date"
              >
                {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>

              <button
                onClick={onToggleSave}
                className="p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white hover:bg-black/80"
                title="Save Show"
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : 'text-slate-200'}`} />
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white hover:bg-black/80"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Artist & Tour Titles */}
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-none mb-1">
              {concert.artist}
            </h1>
            <p className="text-sm sm:text-base font-semibold text-purple-400">
              {concert.title}
            </p>
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Quick Date, Venue & Time Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-stage-900 border border-stage-800 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Show Date</span>
                <span className="font-bold text-white text-xs">{dateFormatted}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Doors & Age</span>
                <span className="font-bold text-white text-xs">Doors {concert.doors_time} • {concert.age_restriction}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Venue Location</span>
                <span className="font-bold text-white text-xs truncate max-w-[170px] block">
                  {concert.venue_name} ({concert.city})
                </span>
              </div>
            </div>
          </div>

          {/* Description & Support Acts */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Tour Overview
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed mb-3">
              {concert.description}
            </p>

            {concert.support_acts.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-300">
                <span className="text-slate-500 font-semibold">Special Guests & Openers:</span>
                {concert.support_acts.map((act) => (
                  <span
                    key={act}
                    className="px-2.5 py-0.5 rounded-lg bg-stage-900 border border-stage-800 text-purple-300 font-medium"
                  >
                    {act}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Setlist Anticipation Sneak Peek */}
          <div className="p-4 rounded-2xl bg-stage-900 border border-stage-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-purple-400" />
                <h4 className="text-sm font-bold text-white">Anticipated Setlist Sneak Peek</h4>
              </div>
              <span className="text-[11px] text-slate-400">Based on recent tour stops</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {concert.setlist_preview.map((song, i) => (
                <div
                  key={song}
                  className="flex items-center gap-2 p-2 rounded-xl bg-stage-950/60 border border-stage-800/80"
                >
                  <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 font-bold text-[10px] flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-slate-200 font-medium truncate">{song}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ticket Selection & Digital Pass Simulator */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-stage-900 to-stage-950 border border-stage-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Ticket className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-bold text-white">Select Ticket Category</h4>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Official Pricing</span>
              </div>
            </div>

            {/* Ticket Tier Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                    className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      !tier.available
                        ? 'opacity-40 cursor-not-allowed border-stage-800 bg-stage-950'
                        : isSelected
                        ? 'border-emerald-500 bg-emerald-500/10 shadow-glow'
                        : 'border-stage-800 bg-stage-900 hover:border-stage-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-white line-clamp-1">{tier.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                      </div>
                      <div className="text-base font-extrabold text-emerald-400 mb-2">
                        ${tier.price}
                        <span className="text-[10px] text-slate-400 font-normal"> /ea</span>
                      </div>
                    </div>
                    <ul className="text-[10px] text-slate-400 space-y-1">
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
            <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-stage-800">
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">Tickets:</span>
                <div className="flex items-center border border-stage-800 rounded-lg overflow-hidden bg-stage-950 text-xs">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      onClick={() => setQuantity(num)}
                      className={`px-3 py-1 font-bold transition-colors ${
                        quantity === num ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <span className="text-xs text-slate-400">
                  Total: <strong className="text-white font-extrabold text-sm">${selectedTier.price * quantity}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                {concert.ticket_url && (
                  <a
                    href={concert.ticket_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5"
                    title="Open official Ticketmaster listing"
                  >
                    <span>Ticketmaster ↗</span>
                  </a>
                )}
                <button
                  onClick={handleBuyPass}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-white font-extrabold text-xs shadow-lg transition-all active:scale-95 flex items-center gap-2"
                >
                  <Ticket className="w-4 h-4" />
                  <span>{ticketPurchased ? 'Pass Confirmed ✓' : 'Reserve Official Pass'}</span>
                </button>
              </div>
            </div>

            {/* Simulated Digital Ticket Badge on Purchase */}
            {ticketPurchased && (
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500 text-black font-black text-xs">
                    PASS
                  </div>
                  <div>
                    <h5 className="font-extrabold text-white text-xs">
                      {quantity}x {selectedTier.name} Confirmed
                    </h5>
                    <p className="text-[11px] text-emerald-400/80">
                      Door barcode pass generated • Show ID at {concert.venue_name}
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Active
                </span>
              </div>
            )}
          </div>

          {/* Squad RSVP & Calendar Sync Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-stage-900 border border-stage-800 text-xs">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              <div>
                <span className="font-bold text-white block">
                  {concert.rsvps_count} fans are attending or interested
                </span>
                <span className="text-slate-400 text-[11px]">
                  Join the attendee squad and coordinate meetups
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenRsvp(concert)}
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all shadow-md active:scale-95"
              >
                RSVP / Who&apos;s Going
              </button>

              {/* Add to Google Calendar */}
              <a
                href={generateGoogleCalendarUrl(concert)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stage-950 border border-stage-800 text-slate-300 hover:text-white hover:border-stage-700 transition-all"
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
