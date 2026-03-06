"use client";

import { useState, useEffect } from "react";
import type { ObraImage } from "@/lib/types";

export function useObraImages(obraId: string | null) {
  const [images, setImages] = useState<ObraImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);

    if (!obraId) {
      setImages([]);
      return;
    }

    setLoading(true);
    fetch(`/api/obras/${obraId}/images`)
      .then((res) => res.json())
      .then((data) => setImages(data))
      .catch(() => {
        setImages([]);
        setError("Error al cargar imagenes");
      })
      .finally(() => setLoading(false));
  }, [obraId]);

  return { images, loading, error };
}
