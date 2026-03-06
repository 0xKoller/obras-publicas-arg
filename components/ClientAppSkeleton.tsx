import { Skeleton } from "@/components/ui/skeleton";
import MapSkeleton from "@/components/map/MapSkeleton";

export function SidebarSkeleton() {
  return (
    <>
      {/* Filter header - "Filtros" label */}
      <div className="flex flex-col gap-3">
        <Skeleton className="h-5 w-16" />

        {/* Search input */}
        <Skeleton className="h-9 w-full" />

        {/* Province select */}
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-9 w-full" />
        </div>

        {/* Year range */}
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-28" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 flex-1" />
            <span className="text-muted-foreground text-sm">a</span>
            <Skeleton className="h-9 flex-1" />
          </div>
        </div>

        {/* Status badges */}
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-16" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>

        {/* Sector badges */}
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-20" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
      </div>

      {/* Separator */}
      <div className="border-border border-t" />

      {/* StatsCards skeleton - grid-cols-2 gap-2, 4 cards */}
      <div className="grid grid-cols-2 gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2 rounded-lg border p-3">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-5 w-12" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>

      {/* Separator */}
      <div className="border-border border-t" />

      {/* Charts skeleton */}
      <div className="flex flex-col gap-4">
        {/* Pie chart */}
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-[180px] w-full rounded-lg" />
        </div>

        {/* Bar chart */}
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-[200px] w-full rounded-lg" />
        </div>
      </div>
    </>
  );
}

export default function ClientAppSkeleton() {
  return (
    <div className="flex min-h-0 flex-1">
      {/* Sidebar skeleton - matching w-80 */}
      <div className="flex w-80 shrink-0 flex-col gap-4 overflow-y-auto border-r bg-white p-4">
        <SidebarSkeleton />
      </div>
      {/* Map skeleton - matching flex-1 */}
      <div className="relative z-0 flex-1">
        <MapSkeleton />
      </div>
    </div>
  );
}
