"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader2, ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";
import type { ObraImage } from "@/lib/types";

interface ImageGalleryProps {
  images: ObraImage[];
  loading: boolean;
}

export default function ImageGallery({ images, loading }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [imgError, setImgError] = useState<Set<number>>(new Set());

  if (loading) {
    return (
      <div className="bg-muted flex h-48 items-center justify-center rounded-lg">
        <Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />
      </div>
    );
  }

  const validImages = images.filter((_, i) => !imgError.has(i));

  if (images.length === 0 || validImages.length === 0) {
    return (
      <div className="bg-muted/50 flex h-48 flex-col items-center justify-center gap-2 rounded-lg">
        <ImageIcon className="text-muted-foreground/40 h-8 w-8" />
        <p className="text-muted-foreground text-xs">
          No hay imagenes disponibles
        </p>
      </div>
    );
  }

  const safeIndex = Math.min(selectedIndex, images.length - 1);
  const currentImage = images[safeIndex];

  return (
    <div className="space-y-2">
      <div className="bg-muted relative h-48 overflow-hidden rounded-lg">
        <Image
          src={currentImage.url}
          alt={currentImage.description || "Foto de la obra"}
          fill
          className="object-cover"
          sizes="(max-width: 450px) 100vw, 400px"
          unoptimized
          onError={() => {
            setImgError((prev) => new Set(prev).add(safeIndex));
            const next = images.findIndex(
              (_, i) => i > safeIndex && !imgError.has(i)
            );
            if (next !== -1) setSelectedIndex(next);
          }}
        />

        {images.length > 1 && (
          <>
            <button
              onClick={() =>
                setSelectedIndex(
                  (prev) => (prev - 1 + images.length) % images.length
                )
              }
              aria-label="Imagen anterior"
              className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white transition-colors hover:bg-black/70"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() =>
                setSelectedIndex((prev) => (prev + 1) % images.length)
              }
              aria-label="Imagen siguiente"
              className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white transition-colors hover:bg-black/70"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}

        <div
          aria-live="polite"
          className="absolute right-2 bottom-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] text-white"
        >
          {safeIndex + 1} / {images.length}
        </div>
      </div>

      {images.length > 1 && (
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {images.map((img, i) =>
            imgError.has(i) ? null : (
              <button
                key={i}
                onClick={() => setSelectedIndex(i)}
                aria-label={`Ver imagen ${i + 1}`}
                className={`relative h-10 w-14 shrink-0 overflow-hidden rounded border-2 transition-colors ${
                  i === safeIndex
                    ? "border-primary"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <Image
                  src={img.url}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="56px"
                  unoptimized
                  onError={() => setImgError((prev) => new Set(prev).add(i))}
                />
              </button>
            )
          )}
        </div>
      )}

      {currentImage.description && (
        <p className="text-muted-foreground text-xs italic">
          {currentImage.description}
        </p>
      )}
    </div>
  );
}
