'use client';

import React from 'react';
import { VolumeX, Disc } from 'lucide-react';

interface AudioPreviewPlayerProps {
  isPlaying: boolean;
  trackName: string | null;
  artistName?: string;
  onStop: () => void;
}

export default function AudioPreviewPlayer({
  isPlaying,
  trackName,
  artistName,
  onStop
}: AudioPreviewPlayerProps) {
  if (!isPlaying || !trackName) return null;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 animate-in slide-in-from-bottom-5 duration-300 max-w-[calc(100vw-2rem)]">
      <div className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3.5 sm:pr-4 pr-3 rounded-2xl bg-[#111322]/95 border border-cyan-500/50 shadow-glow-cyan backdrop-blur-xl text-white">
        {/* Vinyl / Disc spinning icon */}
        <div className="relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/40 shrink-0">
          <Disc className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" style={{ animationDuration: '3s' }} />
          <span className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-cyan-400" />
        </div>

        {/* Track & Live EQ */}
        <div className="pr-1 sm:pr-2 min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              Live Synth Vibe
            </span>
            {/* Animated Equalizer Wave */}
            <div className="flex items-end gap-0.5 h-2.5 sm:h-3 shrink-0">
              <span className="w-0.5 bg-cyan-400 animate-soundwave-1" />
              <span className="w-0.5 bg-cyan-400 animate-soundwave-2" />
              <span className="w-0.5 bg-cyan-400 animate-soundwave-3" />
              <span className="w-0.5 bg-cyan-400 animate-soundwave-4" />
            </div>
          </div>

          <h5 className="font-extrabold text-xs text-white max-w-[130px] xs:max-w-[160px] sm:max-w-[200px] truncate leading-tight mt-0.5">
            {trackName}
          </h5>
          {artistName && (
            <p className="text-[10px] text-slate-400 max-w-[130px] xs:max-w-[160px] sm:max-w-[200px] truncate">
              {artistName}
            </p>
          )}
        </div>

        {/* Stop Button */}
        <button
          onClick={onStop}
          className="p-1.5 sm:p-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition-all active:scale-95 shrink-0"
          title="Stop Audio"
          aria-label="Stop audio preview"
        >
          <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  );
}
