"use client";

import dynamic from "next/dynamic";
import type { Obra } from "@/lib/types";
import MapSkeleton from "./MapSkeleton";

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
