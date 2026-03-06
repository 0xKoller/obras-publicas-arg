"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex-1 flex items-center justify-center min-h-screen">
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md text-center">
        <p className="text-sm text-destructive font-medium mb-4">
          Ocurrio un error inesperado. Por favor, intenta nuevamente.
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md text-sm font-medium hover:bg-destructive/90 transition-colors"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}
