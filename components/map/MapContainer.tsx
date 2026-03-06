"use client";

import dynamic from "next/dynamic";
import type { Obra } from "@/lib/types";

const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-muted rounded-lg">
      <p className="text-muted-foreground">Cargando mapa...</p>
    </div>
  ),
});

interface MapContainerWrapperProps {
  obras: Obra[];
  onSelectObra: (obra: Obra) => void;
}

export default function MapContainerWrapper({
  obras,
  onSelectObra,
}: MapContainerWrapperProps) {
  return <LeafletMap obras={obras} onSelectObra={onSelectObra} />;
}
