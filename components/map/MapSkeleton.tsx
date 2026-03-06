export default function MapSkeleton() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg bg-[#e8ecf1]">
      {/* Simulated tile grid */}
      <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-px opacity-30">
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-[#d1d8e0]"
            style={{ animationDelay: `${i * 75}ms` }}
          />
        ))}
      </div>

      {/* Center content */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3">
        <div className="relative">
          <div className="bg-primary/20 absolute inset-0 h-10 w-10 animate-ping rounded-full" />
          <div className="bg-primary/40 relative flex h-10 w-10 items-center justify-center rounded-full">
            <svg
              className="text-primary h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
        </div>
        <p className="text-muted-foreground animate-pulse text-sm font-medium">
          Cargando mapa...
        </p>
      </div>

      {/* Fake zoom controls */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-0.5">
        <div className="h-8 w-8 rounded-t bg-white/70 shadow-sm" />
        <div className="h-8 w-8 rounded-b bg-white/70 shadow-sm" />
      </div>
    </div>
  );
}
