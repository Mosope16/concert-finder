'use client';

import React, { useEffect, useRef } from 'react';
import { ConcertEvent } from '@/lib/types';
import { GENRE_METADATA } from '@/lib/constants';
import type L from 'leaflet';

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
    if (!mapContainerRef.current || typeof window === 'undefined') return;

    let isCancelled = false;

    const setupMap = async () => {
      // Dynamic import to prevent "window is not defined" in Node/SSR/Vercel
      const leafletModule = await import('leaflet');
      const L = leafletModule.default || leafletModule;

      if (isCancelled || !mapContainerRef.current) return;

      if (!mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: [40.7128, -74.006],
          zoom: 11,
          zoomControl: false,
          attributionControl: true,
          scrollWheelZoom: false,
          preferCanvas: true
        });

        L.control.zoom({ position: 'bottomright' }).addTo(map);

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

      const createStageIcon = (concert: ConcertEvent, isSelected: boolean) => {
        const meta = GENRE_METADATA[concert.genre] || GENRE_METADATA.all;
        const color = isSelected ? '#ffffff' : meta.color;
        const ring = isSelected ? 'border: 2px solid #ffffff; box-shadow: 0 0 16px #c084fc;' : `border: 2px solid ${meta.color};`;

        const html = `
          <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
            ${isSelected ? `<span style="position: absolute; inset: -4px; border-radius: 9999px; border: 2px solid ${meta.color}; opacity: 0.85;"></span>` : ''}
            <div style="
              position: relative;
              width: 30px;
              height: 30px;
              border-radius: 9999px;
              background: #0f1019;
              ${ring}
              display: flex;
              align-items: center;
              justify-content: center;
              color: ${color};
              font-size: 13px;
              font-weight: 900;
            ">
              🎵
            </div>
          </div>
        `;

        return L.divIcon({
          html,
          className: 'custom-stage-pin',
          iconSize: [34, 34],
          iconAnchor: [17, 17],
          popupAnchor: [0, -17]
        });
      };

      // Add markers for all visible concerts
      concerts.forEach((c) => {
        const isSelected = c.id === selectedConcertId;
        const marker = L.marker([c.lat, c.lng], {
          icon: createStageIcon(c, isSelected)
        }).addTo(map);

        const dateStr = new Date(c.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        });

        const popupHtml = `
          <div style="font-family: inherit; width: 190px; padding: 4px;">
            <div style="font-size: 10px; font-weight: 800; color: #c084fc; text-transform: uppercase;">${c.genre} • ${dateStr}</div>
            <div style="font-size: 13px; font-weight: 800; color: #ffffff; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${c.artist}</div>
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
          map.flyTo([selected.lat, selected.lng], 13, { duration: 0.8 });
          markersRef.current[selectedConcertId].openPopup();
        }
      } else if (concerts.length > 0) {
        const bounds = L.latLngBounds(concerts.map((c) => [c.lat, c.lng]));
        map.fitBounds(bounds, { padding: [30, 30], maxZoom: 13 });
      }
    };

    setupMap();

    return () => {
      isCancelled = true;
    };
  }, [concerts, selectedConcertId, onSelectConcert, selectedCity]);

  return (
    <div className="relative w-full h-full min-h-[340px] rounded-2xl sm:rounded-3xl overflow-hidden border border-stage-800 shadow-xl bg-stage-950">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Radar Tag */}
      <div className="absolute top-3 left-3 z-[400] flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/85 border border-stage-700 text-xs font-semibold text-white shadow-md pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-emerald-400" />
        <span>Live Venue Radar</span>
        <span className="text-[10px] text-purple-400 font-bold">({concerts.length} Stages)</span>
      </div>
    </div>
  );
}
