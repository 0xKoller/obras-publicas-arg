"use client";

import { useState, useEffect } from "react";
import type { ObraImage } from "@/lib/types";

export function useObraImages(obraId: string | null) {
  const [images, setImages] = useState<ObraImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!obraId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- clearing state when ID removed
      setImages([]);
      setError(null);
      return;
    }

    setLoading(true);
    fetch(`/api/obras/${obraId}/images`)
      .then((res) => res.json())
      .then((data) => {
        setImages(data);
        setError(null);
      })
      .catch(() => {
        setImages([]);
        setError("Error al cargar imagenes");
      })
      .finally(() => setLoading(false));
  }, [obraId]);

  return { images, loading, error };
}
