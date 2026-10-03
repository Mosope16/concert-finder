'use client';

import React, { useEffect, useRef } from 'react';
import { ConcertEvent } from '@/lib/types';
import { GENRE_METADATA } from '@/lib/constants';
import L from 'leaflet';

interface VenueMapProps {
  concerts: ConcertEvent[];
  selectedConcertId: string | null;
  onSelectConcert: (concert: ConcertEvent) => void;
  selectedCity: string;
}

export default function VenueMap({
  concerts,
  selectedConcertId,
  onSelectConcert,
  selectedCity
}: VenueMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Default to central view
      const map = L.map(mapContainerRef.current, {
        center: [40.7128, -74.006],
        zoom: 11,
        zoomControl: false,
        attributionControl: true
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // OpenStreetMap Humanitarian Tiles - 100% Free, Zero API Keys, Zero Watermarks
      L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    // Custom Neon Stage Pin Creator
    const createStageIcon = (concert: ConcertEvent, isSelected: boolean) => {
      const meta = GENRE_METADATA[concert.genre] || GENRE_METADATA.all;
      const color = isSelected ? '#ffffff' : meta.color;
      const glow = isSelected ? 'box-shadow: 0 0 20px #c084fc, 0 0 35px #a855f7;' : `box-shadow: 0 0 12px ${meta.color};`;

      const html = `
        <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
          ${isSelected ? `<span style="position: absolute; width: 100%; height: 100%; border-radius: 9999px; background: ${meta.color}; opacity: 0.75; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>` : ''}
          <div style="
            position: relative;
            width: 32px;
            height: 32px;
            border-radius: 9999px;
            background: #0f1019;
            border: 2px solid ${color};
            ${glow}
            display: flex;
            align-items: center;
            justify-content: center;
            color: ${color};
            font-size: 14px;
            font-weight: 900;
          ">
            🎵
          </div>
        </div>
      `;

      return L.divIcon({
        html,
        className: 'custom-stage-pin',
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -18]
      });
    };

    // Add markers for all visible concerts
    concerts.forEach((c) => {
      const isSelected = c.id === selectedConcertId;
      const marker = L.marker([c.lat, c.lng], {
        icon: createStageIcon(c, isSelected)
      }).addTo(map);

      // Popup Content
      const dateStr = new Date(c.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });

      const popupHtml = `
        <div style="font-family: inherit; width: 200px; padding: 4px;">
          <div style="font-size: 10px; font-weight: 800; color: #c084fc; text-transform: uppercase;">${c.genre} • ${dateStr}</div>
          <div style="font-size: 14px; font-weight: 800; color: #ffffff; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${c.artist}</div>
          <div style="font-size: 11px; color: #94a3b8; margin-top: 1px;">${c.venue_name}</div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px; padding-top: 6px; border-top: 1px solid #272a3d;">
            <span style="font-weight: 800; color: #34d399; font-size: 13px;">From $${c.price_min}</span>
            <span style="font-size: 10px; background: rgba(192, 132, 252, 0.2); color: #c084fc; padding: 2px 6px; border-radius: 4px; font-weight: 700;">Explore</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.on('click', () => {
        onSelectConcert(c);
      });

      markersRef.current[c.id] = marker;
    });

    // Auto fit or center on selected city/concert
    if (selectedConcertId && markersRef.current[selectedConcertId]) {
      const selected = concerts.find((c) => c.id === selectedConcertId);
      if (selected) {
        map.flyTo([selected.lat, selected.lng], 13, { duration: 1.2 });
        markersRef.current[selectedConcertId].openPopup();
      }
    } else if (concerts.length > 0) {
      const bounds = L.latLngBounds(concerts.map((c) => [c.lat, c.lng]));
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
    }
  }, [concerts, selectedConcertId, onSelectConcert, selectedCity]);

  return (
    <div className="relative w-full h-full min-h-[380px] rounded-3xl overflow-hidden border border-stage-800 shadow-2xl bg-stage-950">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Radar Tag */}
      <div className="absolute top-4 left-4 z-[400] flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-stage-700 text-xs font-semibold text-white shadow-lg">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span>Live Venue Radar</span>
        <span className="text-[10px] text-purple-400 font-bold">({concerts.length} Stages)</span>
      </div>
    </div>
  );
}
