"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import type { Obra, FilterState } from "@/lib/types";
import MapContainerWrapper from "./map/MapContainer";
import FilterPanel from "./filters/FilterPanel";
import ObraDetailPanel from "./detail/ObraDetailPanel";
import StatsCards from "./dashboard/StatsCards";
import Charts from "./dashboard/Charts";
import { Loader2 } from "lucide-react";

export default function ClientApp() {
  const searchParams = useSearchParams();
  const [obras, setObras] = useState<Obra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedObra, setSelectedObra] = useState<Obra | null>(null);
  const [flyTo, setFlyTo] = useState<[number, number] | null>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const currentYear = new Date().getFullYear();
  const defaultYearRange: [number, number] = [currentYear - 3, currentYear];

  const [filters, setFilters] = useState<FilterState>({
    province: null,
    sectors: [],
    statuses: [],
    searchQuery: "",
    yearRange: defaultYearRange,
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/obras")
        .then((res) => {
          if (!res.ok) throw new Error("Error cargando datos");
          return res.json();
        }),
      fetch("/api/geolocation")
        .then((res) => res.json())
        .catch(() => null),
    ])
      .then(([obrasData, geoData]) => {
        setObras(obrasData);
        if (geoData) {
          setUserLocation(geoData);
        } else if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              setUserLocation({
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
              });
            },
            () => {} // User denied or error — stay on default view
          );
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Auto-select obra from URL query param (?obra=ID)
  useEffect(() => {
    const obraId = searchParams.get("obra");
    if (obraId && obras.length > 0 && !selectedObra) {
      const match = obras.find((o) => o.id === obraId);
      if (match) {
        setSelectedObra(match);
        if (match.lat && match.lng) {
          setFlyTo([match.lat, match.lng]);
        }
      }
    }
  }, [searchParams, obras, selectedObra]);

  const filteredObras = useMemo(() => {
    return obras.filter((obra) => {
      if (filters.province && obra.provincia !== filters.province) return false;
      if (
        filters.sectors.length > 0 &&
        !filters.sectors.includes(obra.sector)
      )
        return false;
      if (
        filters.statuses.length > 0 &&
        !filters.statuses.includes(obra.etapa)
      )
        return false;
      if (
        filters.searchQuery &&
        !obra.nombre.toLowerCase().includes(filters.searchQuery.toLowerCase())
      )
        return false;
      if (filters.yearRange) {
        const [minYear, maxYear] = filters.yearRange;
        const start = parseInt(obra.fechaInicio) || 0;
        const end = parseInt(obra.fechaFin) || 9999;
        if (start > maxYear || end < minYear) return false;
      }
      return true;
    });
  }, [obras, filters]);

  const uniqueProvinces = useMemo(
    () => [...new Set(obras.map((o) => o.provincia))].sort(),
    [obras]
  );
  const uniqueSectors = useMemo(
    () => [...new Set(obras.map((o) => o.sector))].sort(),
    [obras]
  );
  const uniqueStatuses = useMemo(
    () => [...new Set(obras.map((o) => o.etapa))].sort(),
    [obras]
  );
  const uniqueYears = useMemo(
    () =>
      [
        ...new Set(
          obras.flatMap((o) => [
            parseInt(o.fechaInicio),
            parseInt(o.fechaFin),
          ])
        ),
      ]
        .filter((y) => !isNaN(y))
        .sort((a, b) => a - b),
    [obras]
  );

  const handleSelectObra = useCallback((obra: Obra) => {
    setSelectedObra(obra);
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Cargando obras publicas...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md text-center">
          <p className="text-sm text-destructive font-medium">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 min-h-0">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r overflow-y-auto p-4 flex flex-col gap-4 shrink-0">
        <FilterPanel
          filters={filters}
          onFiltersChange={setFilters}
          provinces={uniqueProvinces}
          sectors={uniqueSectors}
          statuses={uniqueStatuses}
          years={uniqueYears}
          defaultYearRange={defaultYearRange}
        />
        <Separator />
        <StatsCards obras={filteredObras} />
        <Separator />
        <Charts obras={filteredObras} />
      </div>

      {/* Map */}
      <div className="flex-1 relative z-0">
        <MapContainerWrapper
          obras={filteredObras}
          onSelectObra={handleSelectObra}
          initialCenter={
            userLocation
              ? [userLocation.lat, userLocation.lng]
              : undefined
          }
          initialZoom={userLocation ? 10 : undefined}
          flyTo={flyTo}
        />
      </div>

      {/* Detail Panel */}
      <ObraDetailPanel
        obra={selectedObra}
        onClose={() => setSelectedObra(null)}
      />
    </div>
  );
}

function Separator() {
  return <div className="border-t border-border" />;
}
