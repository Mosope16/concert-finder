'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ConcertEvent } from '@/lib/types';
import {
  X,
  Sparkles,
  Zap,
  Flame,
  Radio,
  Music,
  ArrowRight,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface VibeQuizModalProps {
  concerts: ConcertEvent[];
  onClose: () => void;
  onSelectConcert: (concert: ConcertEvent) => void;
}

export default function VibeQuizModal({
  concerts,
  onClose,
  onSelectConcert
}: VibeQuizModalProps) {
  const [step, setStep] = useState(1);
  const [energy, setEnergy] = useState<string | null>(null);
  const [mood, setMood] = useState<string | null>(null);
  const [budget, setBudget] = useState<string | null>(null);
  const [matchedConcert, setMatchedConcert] = useState<ConcertEvent | null>(null);
  const [matchScore, setMatchScore] = useState(98);

  const handleFinishQuiz = (selectedBudget: string) => {
    setBudget(selectedBudget);

    // Compute best match
    let match = concerts[0];
    if (mood === 'electronic') {
      match = concerts.find((c) => c.genre === 'electronic') || match;
    } else if (mood === 'afro') {
      match = concerts.find((c) => c.genre === 'afrobeats') || match;
    } else if (mood === 'rock') {
      match = concerts.find((c) => c.genre === 'rock-indie' || c.genre === 'metal') || match;
    } else {
      match = concerts.find((c) => c.genre === 'pop' || c.genre === 'hip-hop') || match;
    }

    setMatchedConcert(match);
    setMatchScore(Math.floor(Math.random() * 6) + 94); // 94% - 99%
    setStep(4);

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  const resetQuiz = () => {
    setStep(1);
    setEnergy(null);
    setMood(null);
    setBudget(null);
    setMatchedConcert(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0f111c] border border-stage-800 shadow-2xl text-slate-100 p-6 overflow-hidden">
        {/* Glow ambient background circle */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-pink-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stage-800 relative z-10">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-purple-500 to-pink-500 text-white shadow-glow">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Find My Concert Vibe</h3>
              <p className="text-[11px] text-slate-400">
                {step <= 3 ? `Step ${step} of 3` : 'Match Results'}
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

        {/* Progress Bar */}
        {step <= 3 && (
          <div className="w-full h-1.5 bg-stage-900 rounded-full overflow-hidden my-4">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        )}

        {/* Step 1: Energy */}
        {step === 1 && (
          <div className="space-y-4 py-2 relative z-10">
            <h4 className="text-sm font-bold text-white">
              What kind of energy are you feeling for the night?
            </h4>
            <div className="space-y-2.5">
              {[
                { id: 'stadium', label: '🏟️ High-Octane Stadium Singalong', desc: '50,000 fans, blinding pyro, massive pop & hip-hop hits' },
                { id: 'rave', label: '⚡ Sweaty Late-Night Dance Marathon', desc: 'Heavy basslines, hypnotic lasers until sunrise' },
                { id: 'mosh', label: '🎸 Raw Electric Rock & High Adrenaline', desc: 'Distorted guitars, dynamic riffs and stage diving' },
                { id: 'groove', label: '🌅 Laid-back Sunset & Soul Grooves', desc: 'Warm vintage reverbs, lawn blankets, chilled acoustics' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setEnergy(opt.id);
                    setStep(2);
                  }}
                  className="w-full p-3.5 rounded-2xl bg-stage-900 border border-stage-800 hover:border-purple-500 hover:bg-purple-950/20 text-left transition-all group flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-xs text-white block group-hover:text-purple-300">
                      {opt.label}
                    </span>
                    <span className="text-[11px] text-slate-400">{opt.desc}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Preferred Music Mood */}
        {step === 2 && (
          <div className="space-y-4 py-2 relative z-10">
            <h4 className="text-sm font-bold text-white">
              Which soundscape hooks you right now?
            </h4>
            <div className="space-y-2.5">
              {[
                { id: 'pop', label: '✨ Synth-Pop & Giant Vocal Anthems', desc: 'The Weeknd, Dua Lipa, catchy choruses' },
                { id: 'electronic', label: '🎛️ Underground House & Melodic Techno', desc: 'Fred again.., Peggy Gou, Bicep live AV' },
                { id: 'afro', label: '🔥 Afrobeats & Amapiano Waves', desc: 'Burna Boy, Asake, Rema, infectious rhythm' },
                { id: 'rock', label: '⚡ Garage Rock & Alt-Indie Legends', desc: 'Arctic Monkeys, Foo Fighters, loud drums' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setMood(opt.id);
                    setStep(3);
                  }}
                  className="w-full p-3.5 rounded-2xl bg-stage-900 border border-stage-800 hover:border-pink-500 hover:bg-pink-950/20 text-left transition-all group flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-xs text-white block group-hover:text-pink-300">
                      {opt.label}
                    </span>
                    <span className="text-[11px] text-slate-400">{opt.desc}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-pink-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Ticket Budget */}
        {step === 3 && (
          <div className="space-y-4 py-2 relative z-10">
            <h4 className="text-sm font-bold text-white">
              What is your target budget per ticket?
            </h4>
            <div className="space-y-2.5">
              {[
                { id: 'budget', label: '💸 Under $60 (Chill & Budget Friendly)', desc: 'Lawn seating, club shows, early bird access' },
                { id: 'mid', label: '🎟️ $60 – $120 (Standard Seated or Pitch)', desc: 'Great arena sightlines, prime soundboard position' },
                { id: 'vip', label: '💎 $120+ (Front Stage Pit or VIP Pass)', desc: 'Touch the stage barricade or enjoy private skydeck lounge' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleFinishQuiz(opt.id)}
                  className="w-full p-3.5 rounded-2xl bg-stage-900 border border-stage-800 hover:border-emerald-500 hover:bg-emerald-950/20 text-left transition-all group flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-xs text-white block group-hover:text-emerald-300">
                      {opt.label}
                    </span>
                    <span className="text-[11px] text-slate-400">{opt.desc}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Matched Result */}
        {step === 4 && matchedConcert && (
          <div className="text-center py-4 space-y-4 relative z-10 animate-in zoom-in-95 duration-300">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-pink-300 border border-pink-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{matchScore}% Perfect Live Vibe Match Found!</span>
            </div>

            {/* Matched Concert Card */}
            <div className="relative rounded-2xl overflow-hidden border border-stage-700 bg-stage-900 text-left shadow-2xl">
              <div className="relative h-44 w-full">
                <Image
                  src={matchedConcert.banner_image || matchedConcert.artist_image}
                  alt={matchedConcert.artist}
                  fill
                  sizes="(max-width: 768px) 100vw, 500px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stage-900 via-transparent to-black/40" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-xs text-purple-300 font-semibold">{matchedConcert.venue_name}</span>
                  <h4 className="text-lg font-black">{matchedConcert.artist}</h4>
                  <p className="text-xs text-slate-300">{matchedConcert.title}</p>
                </div>
              </div>

              <div className="p-4 flex items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Starting At</span>
                  <span className="text-emerald-400 font-extrabold text-base">${matchedConcert.price_min}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={resetQuiz}
                    className="p-2 rounded-xl bg-stage-800 hover:bg-stage-700 text-slate-300 transition-colors"
                    title="Retake Quiz"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      onSelectConcert(matchedConcert);
                      onClose();
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-extrabold shadow-glow hover:brightness-110 transition-all flex items-center gap-1.5"
                  >
                    <span>View Tour Stop</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
