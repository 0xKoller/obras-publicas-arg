"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { Obra, FilterState } from "@/lib/types";
import MapContainerWrapper from "./map/MapContainer";
import FilterPanel from "./filters/FilterPanel";
import ObraDetailPanel from "./detail/ObraDetailPanel";
import StatsCards from "./dashboard/StatsCards";
import Charts from "./dashboard/Charts";
import { Loader2 } from "lucide-react";
import { BUENOS_AIRES_CENTER, DEFAULT_FALLBACK_ZOOM } from "@/lib/constants";

export default function ClientApp() {
  const searchParams = useSearchParams();
  const router = useRouter();
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

  const [retryKey, setRetryKey] = useState(0);
  const [filters, setFilters] = useState<FilterState>({
    province: null,
    sectors: [],
    statuses: [],
    searchQuery: "",
    yearRange: defaultYearRange,
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/obras").then((res) => {
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
          setLoading(false);
        } else if ("geolocation" in navigator) {
          // Default to Buenos Aires immediately so the map renders centered there
          setUserLocation({
            lat: BUENOS_AIRES_CENTER[0],
            lng: BUENOS_AIRES_CENTER[1],
          });
          setLoading(false);
          // Override with actual location if user grants permission
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              setUserLocation({
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
              });
            },
            () => {} // Keep Buenos Aires default
          );
        } else {
          // No geolocation API available — default to Buenos Aires
          setUserLocation({
            lat: BUENOS_AIRES_CENTER[0],
            lng: BUENOS_AIRES_CENTER[1],
          });
          setLoading(false);
        }
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [retryKey]);

  // Sync selected obra from URL query param (?obra=ID) — legitimate URL-driven state
  useEffect(() => {
    if (obras.length === 0) return;
    const obraId = searchParams.get("obra");
    if (!obraId) return;
    const match = obras.find((o) => o.id === obraId);
    if (match) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing with URL searchParams
      setSelectedObra(match);
      if (match.lat && match.lng) {
        setFlyTo([match.lat, match.lng]);
      }
    }
  }, [obras, searchParams]);

  const filteredObras = useMemo(() => {
    return obras.filter((obra) => {
      if (filters.province && obra.provincia !== filters.province) return false;
      if (filters.sectors.length > 0 && !filters.sectors.includes(obra.sector))
        return false;
      if (filters.statuses.length > 0 && !filters.statuses.includes(obra.etapa))
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
          obras.flatMap((o) => [parseInt(o.fechaInicio), parseInt(o.fechaFin)])
        ),
      ]
        .filter((y) => !isNaN(y))
        .sort((a, b) => a - b),
    [obras]
  );

  const handleSelectObra = useCallback(
    (obra: Obra) => {
      setSelectedObra(obra);
      router.replace(`/?obra=${obra.id}`, { scroll: false });
    },
    [router]
  );

  const handleCloseObra = useCallback(() => {
    setSelectedObra(null);
    router.replace("/", { scroll: false });
  }, [router]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">
            Cargando obras publicas...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="bg-destructive/10 border-destructive/20 max-w-md rounded-lg border p-6 text-center">
          <p className="text-destructive mb-4 text-sm font-medium">
            Error: {error}
          </p>
          <button
            onClick={() => {
              setError(null);
              setLoading(true);
              setRetryKey((k) => k + 1);
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-md px-4 py-2 text-sm font-medium transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1">
      {/* Sidebar */}
      <div className="flex w-80 shrink-0 flex-col gap-4 overflow-y-auto border-r bg-white p-4">
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
      <div className="relative z-0 flex-1">
        <MapContainerWrapper
          obras={filteredObras}
          onSelectObra={handleSelectObra}
          initialCenter={
            userLocation ? [userLocation.lat, userLocation.lng] : undefined
          }
          initialZoom={userLocation ? DEFAULT_FALLBACK_ZOOM : undefined}
          flyTo={flyTo}
        />
      </div>

      {/* Detail Panel */}
      <ObraDetailPanel obra={selectedObra} onClose={handleCloseObra} />
    </div>
  );
}

function Separator() {
  return <div className="border-border border-t" />;
}
