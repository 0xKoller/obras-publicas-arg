"use client";

import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import type { Obra } from "@/lib/types";
import {
  ARGENTINA_CENTER,
  DEFAULT_ZOOM,
  getStatusColor,
  formatARS,
} from "@/lib/constants";

interface LeafletMapProps {
  obras: Obra[];
  onSelectObra: (obra: Obra) => void;
}

function FitBounds({ obras }: { obras: Obra[] }) {
  const map = useMap();
  if (obras.length === 0) {
    map.setView(ARGENTINA_CENTER, DEFAULT_ZOOM);
  }
  return null;
}

export default function LeafletMap({ obras, onSelectObra }: LeafletMapProps) {
  return (
    <MapContainer
      center={ARGENTINA_CENTER}
      zoom={DEFAULT_ZOOM}
      className="h-full w-full"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds obras={obras} />
      <MarkerClusterGroup chunkedLoading>
        {obras.map((obra) => (
          <CircleMarker
            key={obra.id}
            center={[obra.lat, obra.lng]}
            radius={8}
            pathOptions={{
              fillColor: getStatusColor(obra.etapa),
              color: "#fff",
              weight: 2,
              fillOpacity: 0.8,
            }}
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
          </CircleMarker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
}
