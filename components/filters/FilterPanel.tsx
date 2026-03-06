"use client";

import type { FilterState } from "@/lib/types";
import {
  getStatusColor,
  getStatusIcon,
  getSectorIcon,
  getSectorColor,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface FilterPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  provinces: string[];
  sectors: string[];
  statuses: string[];
  years: number[];
  defaultYearRange: [number, number];
}

export default function FilterPanel({
  filters,
  onFiltersChange,
  provinces,
  sectors,
  statuses,
  years,
  defaultYearRange,
}: FilterPanelProps) {
  const toggleStatus = (status: string) => {
    const next = filters.statuses.includes(status)
      ? filters.statuses.filter((s) => s !== status)
      : [...filters.statuses, status];
    onFiltersChange({ ...filters, statuses: next });
  };

  const toggleSector = (sector: string) => {
    const next = filters.sectors.includes(sector)
      ? filters.sectors.filter((s) => s !== sector)
      : [...filters.sectors, sector];
    onFiltersChange({ ...filters, sectors: next });
  };

  const clearAll = () => {
    onFiltersChange({
      province: null,
      sectors: [],
      statuses: [],
      searchQuery: "",
      yearRange: defaultYearRange,
    });
  };

  const hasFilters =
    filters.province ||
    filters.sectors.length > 0 ||
    filters.statuses.length > 0 ||
    filters.searchQuery ||
    (filters.yearRange &&
      (filters.yearRange[0] !== defaultYearRange[0] ||
        filters.yearRange[1] !== defaultYearRange[1]));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-gov-navy text-xs font-semibold tracking-wider uppercase">
          Filtros
        </h2>
        <button
          onClick={clearAll}
          className={cn(
            "text-primary hover:text-primary/80 text-xs font-medium transition-opacity",
            hasFilters ? "opacity-100" : "pointer-events-none opacity-0"
          )}
          tabIndex={hasFilters ? 0 : -1}
          aria-hidden={!hasFilters}
        >
          Limpiar filtros
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          type="text"
          placeholder="Buscar obra..."
          value={filters.searchQuery}
          onChange={(e) =>
            onFiltersChange({ ...filters, searchQuery: e.target.value })
          }
          aria-label="Buscar obra por nombre"
          className="pl-9"
        />
      </div>

      {/* Province */}
      <div>
        <label className="text-muted-foreground mb-1.5 block text-xs font-medium tracking-wider uppercase">
          Provincia
        </label>
        <Select
          value={filters.province || "all"}
          onValueChange={(v) =>
            onFiltersChange({
              ...filters,
              province: v === "all" ? null : v,
            })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las provincias</SelectItem>
            {provinces.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Year Range */}
      <div>
        <label className="text-muted-foreground mb-1.5 block text-xs font-medium tracking-wider uppercase">
          Periodo
        </label>
        <div className="flex items-center gap-2">
          <Select
            value={filters.yearRange ? String(filters.yearRange[0]) : "all"}
            onValueChange={(v) => {
              if (v === "all") {
                onFiltersChange({ ...filters, yearRange: null });
              } else {
                const from = parseInt(v);
                const to = filters.yearRange
                  ? Math.max(filters.yearRange[1], from)
                  : defaultYearRange[1];
                onFiltersChange({
                  ...filters,
                  yearRange: [from, to],
                });
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Desde" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {years.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-muted-foreground shrink-0 text-xs">a</span>
          <Select
            value={filters.yearRange ? String(filters.yearRange[1]) : "all"}
            onValueChange={(v) => {
              if (v === "all") {
                onFiltersChange({ ...filters, yearRange: null });
              } else {
                const to = parseInt(v);
                const from = filters.yearRange
                  ? Math.min(filters.yearRange[0], to)
                  : defaultYearRange[0];
                onFiltersChange({
                  ...filters,
                  yearRange: [from, to],
                });
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Hasta" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {years.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Status */}
      <div>
        <label className="text-muted-foreground mb-1.5 block text-xs font-medium tracking-wider uppercase">
          Estado
        </label>
        <div className="flex flex-wrap gap-1.5">
          {statuses.map((status) => {
            const StatusIcon = getStatusIcon(status);
            const color = getStatusColor(status);
            const selected = filters.statuses.includes(status);
            return (
              <Badge
                key={status}
                variant={selected ? "default" : "outline"}
                className="cursor-pointer text-xs font-medium"
                style={
                  selected
                    ? {
                        backgroundColor: color,
                        borderColor: color,
                        color: "white",
                      }
                    : { borderColor: color, color }
                }
                role="checkbox"
                aria-checked={selected}
                tabIndex={0}
                onClick={() => toggleStatus(status)}
                onKeyDown={(e) => {
                  if (e.key === " " || e.key === "Enter") {
                    e.preventDefault();
                    toggleStatus(status);
                  }
                }}
              >
                <StatusIcon className="mr-1 h-3 w-3" />
                {status}
              </Badge>
            );
          })}
        </div>
      </div>

      {/* Sector */}
      <div>
        <label className="text-muted-foreground mb-1.5 block text-xs font-medium tracking-wider uppercase">
          Sector
        </label>
        <div className="flex flex-wrap gap-1.5">
          {sectors.map((sector) => {
            const SectorIcon = getSectorIcon(sector);
            const color = getSectorColor(sector);
            const selected = filters.sectors.includes(sector);
            return (
              <Badge
                key={sector}
                variant={selected ? "default" : "outline"}
                className="cursor-pointer text-xs font-medium"
                style={
                  selected
                    ? {
                        backgroundColor: color,
                        borderColor: color,
                        color: "white",
                      }
                    : { borderColor: color, color }
                }
                role="checkbox"
                aria-checked={selected}
                tabIndex={0}
                onClick={() => toggleSector(sector)}
                onKeyDown={(e) => {
                  if (e.key === " " || e.key === "Enter") {
                    e.preventDefault();
                    toggleSector(sector);
                  }
                }}
              >
                <SectorIcon className="mr-1 h-3 w-3" />
                {sector}
              </Badge>
            );
          })}
        </div>
      </div>
    </div>
  );
}
