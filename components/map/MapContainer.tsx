"use client";

import dynamic from "next/dynamic";
import type { Obra } from "@/lib/types";

function MapSkeleton() {
  return (
    <div className="h-full w-full relative bg-[#e8ecf1] rounded-lg overflow-hidden">
      {/* Simulated tile grid */}
      <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-px opacity-30">
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            className="bg-[#d1d8e0] animate-pulse"
            style={{ animationDelay: `${i * 75}ms` }}
          />
        ))}
      </div>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-primary/20 animate-ping absolute inset-0" />
          <div className="w-10 h-10 rounded-full bg-primary/40 flex items-center justify-center relative">
            <svg
              className="w-5 h-5 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
        </div>
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Cargando mapa...
        </p>
      </div>

      {/* Fake zoom controls */}
      <div className="absolute top-3 left-3 flex flex-col gap-0.5 z-10">
        <div className="w-8 h-8 bg-white/70 rounded-t shadow-sm" />
        <div className="w-8 h-8 bg-white/70 rounded-b shadow-sm" />
      </div>
    </div>
  );
}

const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

interface MapContainerWrapperProps {
  obras: Obra[];
  onSelectObra: (obra: Obra) => void;
  initialCenter?: [number, number];
  initialZoom?: number;
  flyTo?: [number, number] | null;
}

export default function MapContainerWrapper({
  obras,
  onSelectObra,
  initialCenter,
  initialZoom,
  flyTo,
}: MapContainerWrapperProps) {
  return (
    <LeafletMap
      obras={obras}
      onSelectObra={onSelectObra}
      initialCenter={initialCenter}
      initialZoom={initialZoom}
      flyTo={flyTo}
    />
  );
}
