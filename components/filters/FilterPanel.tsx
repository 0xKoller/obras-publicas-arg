"use client";

import type { FilterState } from "@/lib/types";
import { getStatusColor } from "@/lib/constants";
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
}

export default function FilterPanel({
  filters,
  onFiltersChange,
  provinces,
  sectors,
  statuses,
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
    });
  };

  const hasFilters =
    filters.province ||
    filters.sectors.length > 0 ||
    filters.statuses.length > 0 ||
    filters.searchQuery;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gov-navy">
          Filtros
        </h2>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-primary hover:text-primary/80 font-medium"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar obra..."
          value={filters.searchQuery}
          onChange={(e) =>
            onFiltersChange({ ...filters, searchQuery: e.target.value })
          }
          className="pl-9"
        />
      </div>

      {/* Province */}
      <div>
        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5 block">
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

      {/* Status */}
      <div>
        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5 block">
          Estado
        </label>
        <div className="flex flex-wrap gap-1.5">
          {statuses.map((status) => (
            <Badge
              key={status}
              variant={
                filters.statuses.includes(status) ? "default" : "outline"
              }
              className="cursor-pointer text-xs font-medium"
              style={
                filters.statuses.includes(status)
                  ? { backgroundColor: getStatusColor(status), borderColor: getStatusColor(status) }
                  : undefined
              }
              onClick={() => toggleStatus(status)}
            >
              {status}
            </Badge>
          ))}
        </div>
      </div>

      {/* Sector */}
      <div>
        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5 block">
          Sector
        </label>
        <div className="flex flex-wrap gap-1.5">
          {sectors.map((sector) => (
            <Badge
              key={sector}
              variant={
                filters.sectors.includes(sector) ? "default" : "outline"
              }
              className="cursor-pointer text-xs font-medium"
              onClick={() => toggleSector(sector)}
            >
              {sector}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
