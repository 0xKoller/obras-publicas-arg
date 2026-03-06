"use client";

import { useState, useEffect } from "react";
import type { ObraImage } from "@/lib/types";

export function useObraImages(obraId: string | null) {
  const [images, setImages] = useState<ObraImage[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!obraId) {
      setImages([]);
      return;
    }

    setLoading(true);
    fetch(`/api/obras/${obraId}/images`)
      .then((res) => res.json())
      .then((data) => setImages(data))
      .catch(() => setImages([]))
      .finally(() => setLoading(false));
  }, [obraId]);

  return { images, loading };
}
