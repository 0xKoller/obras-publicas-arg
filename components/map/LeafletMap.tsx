"use client";

import { useMemo, useState, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import type L from "leaflet";
import type { LatLngBounds } from "leaflet";
import type { Obra } from "@/lib/types";
import {
  ARGENTINA_CENTER,
  ARGENTINA_BOUNDS,
  DEFAULT_ZOOM,
  MIN_ZOOM,
  MAX_ZOOM,
  MAX_BOUNDS_VISCOSITY,
  TILE_URL,
  TILE_ATTRIBUTION,
  getStatusColor,
  formatARS,
} from "@/lib/constants";
import { createObraIcon, createClusterIcon } from "./map-icons";

interface LeafletMapProps {
  obras: Obra[];
  onSelectObra: (obra: Obra) => void;
  initialCenter?: [number, number];
  initialZoom?: number;
}

function FitBounds({ obras }: { obras: Obra[] }) {
  const map = useMap();
  if (obras.length === 0) {
    map.setView(ARGENTINA_CENTER, DEFAULT_ZOOM);
  }
  return null;
}

function ViewportMarkers({
  obras,
  onSelectObra,
  getIcon,
}: {
  obras: Obra[];
  onSelectObra: (obra: Obra) => void;
  getIcon: (statusColor: string, sector: string) => L.DivIcon;
}) {
  const map = useMap();
  const [bounds, setBounds] = useState<LatLngBounds | null>(
    () => map.getBounds()
  );

  const updateBounds = useCallback(() => {
    setBounds(map.getBounds());
  }, [map]);

  useMapEvents({
    moveend: updateBounds,
    zoomend: updateBounds,
  });

  const visibleObras = useMemo(() => {
    if (!bounds) return obras;
    const padded = bounds.pad(0.1);
    return obras.filter((obra) => padded.contains([obra.lat, obra.lng]));
  }, [obras, bounds]);

  return (
    <MarkerClusterGroup
      chunkedLoading
      iconCreateFunction={createClusterIcon}
    >
      {visibleObras.map((obra) => (
        <Marker
          key={obra.id}
          position={[obra.lat, obra.lng]}
          icon={getIcon(getStatusColor(obra.etapa), obra.sector)}
          eventHandlers={{
            click: () => onSelectObra(obra),
          }}
        >
          <Popup>
            <div className="max-w-[250px] font-sans">
              <p className="font-semibold text-sm text-[#0B2D45]">
                {obra.nombre}
              </p>
              <p className="text-xs text-gray-600">
                {obra.provincia} - {obra.departamento}
              </p>
              <p className="text-xs mt-1">
                <span
                  className="inline-block px-2 py-0.5 rounded text-white text-[10px] font-medium"
                  style={{ backgroundColor: getStatusColor(obra.etapa) }}
                >
                  {obra.etapa}
                </span>
              </p>
              <p className="text-xs mt-1 font-medium">
                {formatARS(obra.montoTotal)}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MarkerClusterGroup>
  );
}

export default function LeafletMap({
  obras,
  onSelectObra,
  initialCenter,
  initialZoom,
}: LeafletMapProps) {
  const getIcon = useMemo(() => {
    const cache = new Map<string, L.DivIcon>();
    return (statusColor: string, sector: string) => {
      const key = `${statusColor}|${sector}`;
      if (!cache.has(key)) {
        cache.set(key, createObraIcon(statusColor, sector));
      }
      return cache.get(key)!;
    };
  }, []);

  return (
    <MapContainer
      center={initialCenter ?? ARGENTINA_CENTER}
      zoom={initialZoom ?? DEFAULT_ZOOM}
      minZoom={MIN_ZOOM}
      maxZoom={MAX_ZOOM}
      maxBounds={ARGENTINA_BOUNDS}
      maxBoundsViscosity={MAX_BOUNDS_VISCOSITY}
      className="h-full w-full"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution={TILE_ATTRIBUTION}
        url={TILE_URL}
        bounds={ARGENTINA_BOUNDS}
        updateWhenZooming={false}
        updateWhenIdle={true}
        keepBuffer={2}
      />
      <FitBounds obras={obras} />
      <ViewportMarkers
        obras={obras}
        onSelectObra={onSelectObra}
        getIcon={getIcon}
      />
    </MapContainer>
  );
}
