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
      <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const validImages = images.filter((_, i) => !imgError.has(i));

  if (images.length === 0 || validImages.length === 0) {
    return (
      <div className="h-32 bg-muted/50 rounded-lg flex flex-col items-center justify-center gap-2">
        <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
        <p className="text-xs text-muted-foreground">
          No hay imagenes disponibles
        </p>
      </div>
    );
  }

  const safeIndex = Math.min(selectedIndex, images.length - 1);
  const currentImage = images[safeIndex];

  return (
    <div className="space-y-2">
      <div className="relative h-48 bg-muted rounded-lg overflow-hidden">
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
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() =>
                setSelectedIndex((prev) => (prev + 1) % images.length)
              }
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}

        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full">
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
                className={`relative shrink-0 w-14 h-10 rounded overflow-hidden border-2 transition-colors ${
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
                  onError={() =>
                    setImgError((prev) => new Set(prev).add(i))
                  }
                />
              </button>
            )
          )}
        </div>
      )}

      {currentImage.description && (
        <p className="text-xs text-muted-foreground italic">
          {currentImage.description}
        </p>
      )}
    </div>
  );
}
