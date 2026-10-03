'use client';

import React from 'react';
import { Volume2, VolumeX, Sparkles, Disc } from 'lucide-react';

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
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-center gap-3 p-3.5 pr-4 rounded-2xl bg-[#111322]/95 border border-cyan-500/50 shadow-glow-cyan backdrop-blur-xl text-white">
        {/* Vinyl / Disc spinning icon */}
        <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/40">
          <Disc className="w-5 h-5 animate-spin" style={{ animationDuration: '3s' }} />
          <span className="absolute w-2 h-2 rounded-full bg-cyan-400" />
        </div>

        {/* Track & Live EQ */}
        <div className="pr-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              Live Synth Vibe
            </span>
            {/* Animated Equalizer Wave */}
            <div className="flex items-end gap-0.5 h-3">
              <span className="w-0.5 bg-cyan-400 animate-soundwave-1" />
              <span className="w-0.5 bg-cyan-400 animate-soundwave-2" />
              <span className="w-0.5 bg-cyan-400 animate-soundwave-3" />
              <span className="w-0.5 bg-cyan-400 animate-soundwave-4" />
            </div>
          </div>

          <h5 className="font-extrabold text-xs text-white max-w-[180px] truncate leading-tight mt-0.5">
            {trackName}
          </h5>
          {artistName && (
            <p className="text-[10px] text-slate-400 max-w-[180px] truncate">
              {artistName}
            </p>
          )}
        </div>

        {/* Stop Button */}
        <button
          onClick={onStop}
          className="p-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition-all active:scale-95"
          title="Stop Audio"
        >
          <VolumeX className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
