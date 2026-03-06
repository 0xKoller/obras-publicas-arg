"use client";

import { useState, useEffect } from "react";
import type { FeatureCollection, Geometry } from "geojson";

export interface DepartmentProperties {
  id: number;
  departamento: string;
  cabecera: string;
  provincia: string;
}

export function useDepartmentBoundaries() {
  const [geojson, setGeojson] = useState<FeatureCollection<
    Geometry,
    DepartmentProperties
  > | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetch("/data/departamentos.geojson")
      .then((res) => {
        if (!res.ok)
          throw new Error(`Failed to fetch boundaries: ${res.status}`);
        return res.json();
      })
      .then((fc: FeatureCollection<Geometry, DepartmentProperties>) => {
        if (cancelled) return;
        setGeojson(fc);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { geojson, loading, error };
}
