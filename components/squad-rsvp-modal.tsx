'use client';

import React, { useState } from 'react';
import { ConcertEvent, UserRSVP } from '@/lib/types';
import { recordUserRSVP, getUserRSVPs } from '@/lib/storage';
import { X, Users, CheckCircle2, PartyPopper, Ticket, Send } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SquadRsvpModalProps {
  concert: ConcertEvent;
  onClose: () => void;
  onRsvpSuccess: (updatedConcert: ConcertEvent) => void;
}

export default function SquadRsvpModal({
  concert,
  onClose,
  onRsvpSuccess
}: SquadRsvpModalProps) {
  const [userName, setUserName] = useState('');
  const [status, setStatus] = useState<'going' | 'interested'>('going');
  const [ticketTier, setTicketTier] = useState(concert.ticket_tiers[0]?.name || 'General Admission');
  const [submitted, setSubmitted] = useState(false);

  const existingRsvps = getUserRSVPs().filter((r) => r.concert_id === concert.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) return;

    const { updatedConcert } = recordUserRSVP(
      concert.id,
      userName.trim(),
      ticketTier,
      status
    );

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });

    setSubmitted(true);
    if (updatedConcert) {
      onRsvpSuccess(updatedConcert);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-[#0f111c] border border-stage-800 shadow-2xl text-slate-100 p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stage-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Squad RSVP Planner</h3>
              <p className="text-[11px] text-slate-400 truncate max-w-[240px]">
                {concert.artist} @ {concert.venue_name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stage-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        {!submitted ? (
          <form onSubmit={handleSubmit} className="py-4 space-y-4 text-xs">
            {/* Name Input */}
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">
                Your Name or Squad Handle
              </label>
              <input
                type="text"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="e.g. Jordan & Chloe, Alex K."
                className="w-full px-3.5 py-2.5 rounded-xl bg-stage-900 border border-stage-800 text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            {/* Attendance Status */}
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">
                Attendance Plan
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setStatus('going')}
                  className={`p-3 rounded-xl border text-center font-bold transition-all ${
                    status === 'going'
                      ? 'bg-purple-600/20 border-purple-500 text-purple-300 shadow-glow'
                      : 'bg-stage-900 border-stage-800 text-slate-400 hover:text-white'
                  }`}
                >
                  🎉 Definitely Going!
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('interested')}
                  className={`p-3 rounded-xl border text-center font-bold transition-all ${
                    status === 'interested'
                      ? 'bg-cyan-600/20 border-cyan-500 text-cyan-300 shadow-glow-cyan'
                      : 'bg-stage-900 border-stage-800 text-slate-400 hover:text-white'
                  }`}
                >
                  👀 Interested / Looking
                </button>
              </div>
            </div>

            {/* Preferred Ticket Tier */}
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">
                Target Seating Section
              </label>
              <select
                value={ticketTier}
                onChange={(e) => setTicketTier(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stage-900 border border-stage-800 text-white focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                {concert.ticket_tiers.map((t) => (
                  <option key={t.id} value={t.name}>
                    {t.name} (${t.price})
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:brightness-110 text-white font-extrabold transition-all shadow-glow flex items-center justify-center gap-2 active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Confirm Squad RSVP</span>
            </button>
          </form>
        ) : (
          <div className="text-center py-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-white text-base">You&apos;re On The List!</h4>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Your RSVP for {userName} has been saved. Other concert-goers can see your squad in the attendee feed.
            </p>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-stage-800 hover:bg-stage-700 text-white font-bold text-xs"
            >
              Done
            </button>
          </div>
        )}

        {/* Recent Attendees List */}
        {existingRsvps.length > 0 && (
          <div className="pt-4 border-t border-stage-800 mt-2 text-xs">
            <span className="text-[11px] font-bold text-slate-400 block mb-2">
              Recent RSVPs for this show ({existingRsvps.length}):
            </span>
            <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
              {existingRsvps.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-stage-900/60 border border-stage-800/80 text-[11px]"
                >
                  <span className="font-semibold text-slate-200">{r.user_name}</span>
                  <span className="text-purple-400 font-medium">{r.ticket_tier}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
