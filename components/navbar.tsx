'use client';

import React from 'react';
import { CITIES } from '@/lib/constants';
import {
  Music2,
  MapPin,
  Search,
  Heart,
  Sparkles,
  Volume2,
  VolumeX,
  Compass
} from 'lucide-react';

interface NavbarProps {
  selectedCity: string;
  onCityChange: (city: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  savedCount: number;
  showOnlySaved: boolean;
  onToggleSavedOnly: () => void;
  onOpenQuiz: () => void;
  isPlayingAudio: boolean;
  currentAudioTrack: string | null;
  onStopAudio: () => void;
}

export default function Navbar({
  selectedCity,
  onCityChange,
  searchQuery,
  onSearchChange,
  savedCount,
  showOnlySaved,
  onToggleSavedOnly,
  onOpenQuiz,
  isPlayingAudio,
  currentAudioTrack,
  onStopAudio
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-stage-800 bg-[#090a10]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-500 shadow-glow">
            <Music2 className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-pink-500" />
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-black tracking-tight text-white">
                CONCERT<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">FINDER</span>
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Live Tour Radar
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Discover arena tours, club nights & festival stages
            </p>
          </div>
        </div>

        {/* Search & City Filter (Desktop) */}
        <div className="flex-1 max-w-md hidden md:flex items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search artist, tour, or venue..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-stage-900 border border-stage-800 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all"
            />
          </div>

          {/* City Selector */}
          <div className="relative">
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stage-900 border border-stage-800 text-xs text-slate-200 cursor-pointer hover:border-stage-700">
              <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <select
                value={selectedCity}
                onChange={(e) => onCityChange(e.target.value)}
                className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer pr-1"
              >
                {CITIES.map((c) => (
                  <option key={c.value} value={c.value} className="bg-stage-900 text-slate-200">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Audio Preview Indicator (if playing) */}
          {isPlayingAudio && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/50 border border-cyan-500/40 text-cyan-300 text-xs shadow-glow-cyan animate-pulse">
              <Volume2 className="w-3.5 h-3.5" />
              <span className="hidden lg:inline-block max-w-[120px] truncate text-[11px] font-medium">
                {currentAudioTrack}
              </span>
              <button
                onClick={onStopAudio}
                className="p-1 hover:text-white transition-colors"
                title="Stop Audio Preview"
              >
                <VolumeX className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Vibe Matcher Quiz Button */}
          <button
            onClick={onOpenQuiz}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:brightness-110 shadow-glow transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Match My Vibe</span>
          </button>

          {/* Saved Shows Toggle */}
          <button
            onClick={onToggleSavedOnly}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              showOnlySaved
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-glow-pink'
                : 'bg-stage-900 border-stage-800 text-slate-300 hover:border-stage-700 hover:text-white'
            }`}
            title="Saved Tour Dates"
          >
            <Heart className={`w-3.5 h-3.5 ${showOnlySaved ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">Saved</span>
            {savedCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar & City Selector */}
      <div className="md:hidden px-4 py-2 border-t border-stage-800/80 bg-stage-950 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search artist or venue..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-stage-900 border border-stage-800 text-slate-100 placeholder:text-slate-500 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-stage-900 border border-stage-800 text-xs text-slate-200">
          <MapPin className="w-3 h-3 text-purple-400" />
          <select
            value={selectedCity}
            onChange={(e) => onCityChange(e.target.value)}
            className="bg-transparent text-xs text-slate-200 focus:outline-none pr-1 max-w-[100px]"
          >
            {CITIES.map((c) => (
              <option key={c.value} value={c.value} className="bg-stage-900 text-slate-200">
                {c.name.split(',')[0]}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}
