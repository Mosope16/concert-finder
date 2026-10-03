'use client';

import React from 'react';
import { GenreCategory, EventType, FilterState } from '@/lib/types';
import { GENRE_METADATA } from '@/lib/constants';
import {
  SlidersHorizontal,
  Flame,
  LayoutGrid,
  Map as MapIcon,
  Columns,
  DollarSign,
  Ticket
} from 'lucide-react';

interface FiltersBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  layoutMode: 'split' | 'grid' | 'map';
  onLayoutChange: (mode: 'split' | 'grid' | 'map') => void;
  totalResultsCount: number;
}

const GENRE_KEYS: GenreCategory[] = [
  'all',
  'pop',
  'hip-hop',
  'electronic',
  'rock-indie',
  'afrobeats',
  'r-and-b',
  'jazz-soul',
  'metal'
];

const EVENT_TYPES: { id: EventType; label: string }[] = [
  { id: 'all', label: 'All Formats' },
  { id: 'stadium-tour', label: '🏟️ Stadium Tour' },
  { id: 'arena', label: '⚡ Arena Show' },
  { id: 'festival', label: '🎪 Music Festival' },
  { id: 'intimate-club', label: '🍸 Club / Warehouse' },
  { id: 'amphitheater', label: '🌲 Amphitheater' }
];

export default function FiltersBar({
  filters,
  onFilterChange,
  layoutMode,
  onLayoutChange,
  totalResultsCount
}: FiltersBarProps) {
  return (
    <div className="w-full border-b border-stage-800 bg-[#0c0d15] py-3 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Top Row: Genre Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {GENRE_KEYS.map((genreKey) => {
            const meta = GENRE_METADATA[genreKey];
            const isActive = filters.genre === genreKey;

            return (
              <button
                key={genreKey}
                onClick={() => onFilterChange({ genre: genreKey })}
                className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all border ${
                  isActive
                    ? 'bg-purple-600 text-white border-purple-400 shadow-glow'
                    : 'bg-stage-900 text-slate-300 border-stage-800 hover:border-stage-700 hover:text-white'
                }`}
              >
                {meta.label}
              </button>
            );
          })}
        </div>

        {/* Bottom Row: Event Type, Price, Sort & Layout Switch */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
          {/* Left: Event Type Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {EVENT_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => onFilterChange({ eventType: type.id })}
                className={`px-2.5 py-1 rounded-lg font-medium shrink-0 transition-all border ${
                  filters.eventType === type.id
                    ? 'bg-stage-800 text-cyan-300 border-cyan-500/40'
                    : 'bg-transparent text-slate-400 border-transparent hover:text-slate-200'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* Right: Controls & Layout */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Available Tickets Only Checkbox */}
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 select-none hover:text-white">
              <input
                type="checkbox"
                checked={filters.ticketStatus === 'available-only'}
                onChange={(e) =>
                  onFilterChange({
                    ticketStatus: e.target.checked ? 'available-only' : 'all'
                  })
                }
                className="rounded bg-stage-900 border-stage-700 text-purple-600 focus:ring-0"
              />
              <span className="hidden sm:inline">Tickets Available</span>
              <Ticket className="w-3.5 h-3.5 text-purple-400 sm:hidden" />
            </label>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1 bg-stage-900 border border-stage-800 rounded-lg px-2 py-1">
              <span className="text-slate-400 hidden sm:inline">Sort:</span>
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  onFilterChange({
                    sortBy: e.target.value as FilterState['sortBy']
                  })
                }
                className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="date" className="bg-stage-900">Upcoming Date</option>
                <option value="price-low" className="bg-stage-900">Price: Low to High</option>
                <option value="price-high" className="bg-stage-900">Price: High to Low</option>
                <option value="popularity" className="bg-stage-900">Most Popular / RSVPs</option>
              </select>
            </div>

            {/* Layout Mode Switch */}
            <div className="hidden md:flex items-center bg-stage-900 border border-stage-800 rounded-lg p-0.5">
              <button
                onClick={() => onLayoutChange('split')}
                className={`p-1.5 rounded-md transition-colors ${
                  layoutMode === 'split' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Split View (Map + Shows)"
              >
                <Columns className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onLayoutChange('grid')}
                className={`p-1.5 rounded-md transition-colors ${
                  layoutMode === 'grid' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Cards Grid"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onLayoutChange('map')}
                className={`p-1.5 rounded-md transition-colors ${
                  layoutMode === 'map' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Full Screen Map Radar"
              >
                <MapIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
