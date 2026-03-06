"use client";

import { useState, useEffect, useMemo } from "react";
import type { Obra } from "@/lib/types";
import { formatARS } from "@/lib/constants";
import {
  PRESIDENTIAL_PERIODS,
  getPresidentialPeriod,
} from "@/lib/presidential-periods";
import {
  Loader2,
  Building2,
  DollarSign,
  CheckCircle2,
  X,
} from "lucide-react";
import {
  getStatusColor,
  getStatusIcon,
  getSectorIcon,
  getSectorColor,
} from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import PresidentFilter from "./PresidentFilter";
import ObrasByPresidentChart from "./ObrasByPresidentChart";
import BudgetByPresidentChart from "./BudgetByPresidentChart";
import SectorByPresidentChart from "./SectorByPresidentChart";
import ProvinceRankingChart from "./ProvinceRankingChart";
import ObrasStartedChart from "./ObrasStartedChart";
import ObrasFinishedChart from "./ObrasFinishedChart";
import YearlyTimelineChart from "./YearlyTimelineChart";
import ObrasTable from "./ObrasTable";

export default function AnalyticsClient() {
  const [obras, setObras] = useState<Obra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPresident, setSelectedPresident] = useState<string | null>(
    null
  );
  const [selectedProvinces, setSelectedProvinces] = useState<string[]>([]);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/obras")
      .then((res) => {
        if (!res.ok) throw new Error("Error cargando datos");
        return res.json();
      })
      .then((data) => {
        setObras(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const uniqueProvinces = useMemo(
    () => [...new Set(obras.map((o) => o.provincia))].sort(),
    [obras]
  );
  const uniqueSectors = useMemo(
    () => [...new Set(obras.map((o) => o.sector))].sort(),
    [obras]
  );
  const uniqueStatuses = useMemo(
    () => [...new Set(obras.map((o) => o.etapa))].sort(),
    [obras]
  );

  // Available values given all OTHER active filters (excluding the filter's own dimension)
  const availableProvinces = useMemo(() => {
    const filtered = obras.filter((o) => {
      if (selectedPresident && getPresidentialPeriod(o.fechaInicio)?.president !== selectedPresident) return false;
      if (selectedSectors.length > 0 && !selectedSectors.includes(o.sector)) return false;
      if (selectedStatuses.length > 0 && !selectedStatuses.includes(o.etapa)) return false;
      return true;
    });
    return new Set(filtered.map((o) => o.provincia));
  }, [obras, selectedPresident, selectedSectors, selectedStatuses]);

  const availableSectors = useMemo(() => {
    const filtered = obras.filter((o) => {
      if (selectedPresident && getPresidentialPeriod(o.fechaInicio)?.president !== selectedPresident) return false;
      if (selectedProvinces.length > 0 && !selectedProvinces.includes(o.provincia)) return false;
      if (selectedStatuses.length > 0 && !selectedStatuses.includes(o.etapa)) return false;
      return true;
    });
    return new Set(filtered.map((o) => o.sector));
  }, [obras, selectedPresident, selectedProvinces, selectedStatuses]);

  const availableStatuses = useMemo(() => {
    const filtered = obras.filter((o) => {
      if (selectedPresident && getPresidentialPeriod(o.fechaInicio)?.president !== selectedPresident) return false;
      if (selectedProvinces.length > 0 && !selectedProvinces.includes(o.provincia)) return false;
      if (selectedSectors.length > 0 && !selectedSectors.includes(o.sector)) return false;
      return true;
    });
    return new Set(filtered.map((o) => o.etapa));
  }, [obras, selectedPresident, selectedProvinces, selectedSectors]);

  const hasActiveFilters =
    selectedPresident !== null ||
    selectedProvinces.length > 0 ||
    selectedSectors.length > 0 ||
    selectedStatuses.length > 0;

  const clearAllFilters = () => {
    setSelectedPresident(null);
    setSelectedProvinces([]);
    setSelectedSectors([]);
    setSelectedStatuses([]);
  };

  const toggleProvince = (province: string) => {
    setSelectedProvinces((prev) =>
      prev.includes(province) ? prev.filter((p) => p !== province) : [...prev, province]
    );
  };

  const toggleSector = (sector: string) => {
    setSelectedSectors((prev) =>
      prev.includes(sector) ? prev.filter((s) => s !== sector) : [...prev, sector]
    );
  };

  const toggleStatus = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  const filteredObras = useMemo(() => {
    return obras.filter((o) => {
      if (
        selectedPresident &&
        getPresidentialPeriod(o.fechaInicio)?.president !== selectedPresident
      )
        return false;
      if (selectedProvinces.length > 0 && !selectedProvinces.includes(o.provincia)) return false;
      if (selectedSectors.length > 0 && !selectedSectors.includes(o.sector))
        return false;
      if (selectedStatuses.length > 0 && !selectedStatuses.includes(o.etapa))
        return false;
      return true;
    });
  }, [obras, selectedPresident, selectedProvinces, selectedSectors, selectedStatuses]);

  // --- Existing aggregations (use filteredObras) ---

  const obrasByPresident = useMemo(() => {
    return PRESIDENTIAL_PERIODS.map((period) => {
      const periodObras = filteredObras.filter(
        (o) =>
          getPresidentialPeriod(o.fechaInicio)?.president === period.president
      );
      return {
        name: period.shortName,
        color: period.color,
        Finalizadas: periodObras.filter((o) => o.etapa === "Finalizada").length,
        "En ejecucion": periodObras.filter((o) => o.etapa === "En ejecución")
          .length,
        Paralizadas: periodObras.filter((o) => o.etapa === "Paralizada").length,
        Otras: periodObras.filter(
          (o) =>
            !["Finalizada", "En ejecución", "Paralizada"].includes(o.etapa)
        ).length,
        total: periodObras.length,
      };
    });
  }, [filteredObras]);

  const budgetByPresident = useMemo(() => {
    return PRESIDENTIAL_PERIODS.map((period) => {
      const total = filteredObras
        .filter(
          (o) =>
            getPresidentialPeriod(o.fechaInicio)?.president === period.president
        )
        .reduce((sum, o) => sum + o.montoTotal, 0);
      return {
        name: period.shortName,
        budget: total,
        color: period.color,
      };
    });
  }, [filteredObras]);

  const { sectorByPresident, allSectors } = useMemo(() => {
    const sectorCounts: Record<string, number> = {};
    for (const o of filteredObras) {
      sectorCounts[o.sector] = (sectorCounts[o.sector] || 0) + 1;
    }
    const topSectors = Object.entries(sectorCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name]) => name);

    const data: Record<string, string | number>[] = PRESIDENTIAL_PERIODS.map(
      (period) => {
        const periodObras = filteredObras.filter(
          (o) =>
            getPresidentialPeriod(o.fechaInicio)?.president === period.president
        );
        const counts: Record<string, number> = {};
        for (const o of periodObras) {
          const sector = topSectors.includes(o.sector) ? o.sector : "Otros";
          counts[sector] = (counts[sector] || 0) + 1;
        }
        return { name: period.shortName, ...counts };
      }
    );

    const sectors = [...topSectors];
    const hasOtros = data.some((d) => {
      const val = d["Otros"];
      return typeof val === "number" && val > 0;
    });
    if (hasOtros) sectors.push("Otros");

    return { sectorByPresident: data, allSectors: sectors };
  }, [filteredObras]);

  const provinceRanking = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const o of filteredObras) {
      counts[o.provincia] = (counts[o.provincia] || 0) + 1;
    }
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [filteredObras]);

  // --- New aggregations (use filteredObras) ---

  const obrasStarted = useMemo(() => {
    return PRESIDENTIAL_PERIODS.map((period) => ({
      name: period.shortName,
      started: filteredObras.filter(
        (o) =>
          getPresidentialPeriod(o.fechaInicio)?.president === period.president
      ).length,
      color: period.color,
    }));
  }, [filteredObras]);

  const obrasFinished = useMemo(() => {
    return PRESIDENTIAL_PERIODS.map((period) => ({
      name: period.shortName,
      finished: filteredObras.filter((o) => {
        if (o.etapa !== "Finalizada") return false;
        return (
          getPresidentialPeriod(o.fechaFin)?.president === period.president
        );
      }).length,
      color: period.color,
    }));
  }, [filteredObras]);

  const yearlyTimeline = useMemo(() => {
    const counts: Record<number, number> = {};
    for (const o of filteredObras) {
      const year = parseInt(o.fechaInicio, 10);
      if (!isNaN(year) && year >= 2003) {
        counts[year] = (counts[year] || 0) + 1;
      }
    }
    return Object.entries(counts)
      .map(([yearStr, count]) => {
        const year = parseInt(yearStr, 10);
        const period = getPresidentialPeriod(yearStr);
        return { year, count, color: period?.color ?? "#6b7280" };
      })
      .sort((a, b) => a.year - b.year);
  }, [filteredObras]);

  // --- Summary stats (use filteredObras) ---

  const summaryStats = useMemo(() => {
    const totalBudget = filteredObras.reduce((sum, o) => sum + o.montoTotal, 0);
    const completed = filteredObras.filter(
      (o) => o.etapa === "Finalizada"
    ).length;
    const completionRate =
      filteredObras.length > 0
        ? ((completed / filteredObras.length) * 100).toFixed(1)
        : "0";
    return { totalBudget, completed, completionRate };
  }, [filteredObras]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Cargando estadisticas...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md text-center">
          <p className="text-sm text-destructive font-medium">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto bg-secondary/30">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gov-navy">Estadisticas</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Analisis de obras publicas por periodo presidencial
          </p>
        </div>

        {/* Filters */}
        <div className="rounded-lg border border-border/60 bg-white p-4 space-y-4">
          <PresidentFilter
            selected={selectedPresident}
            onSelect={setSelectedPresident}
          />

          <div className="border-t border-border pt-4 space-y-4">
            {/* Estado */}
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5 block">
                Estado
              </label>
              <div className="flex flex-wrap gap-1.5">
                {uniqueStatuses.map((status) => {
                  const StatusIcon = getStatusIcon(status);
                  const color = getStatusColor(status);
                  const selected = selectedStatuses.includes(status);
                  const available = availableStatuses.has(status);
                  return (
                    <Badge
                      key={status}
                      variant={selected ? "default" : "outline"}
                      className={`text-xs font-medium ${
                        available
                          ? "cursor-pointer"
                          : "cursor-not-allowed opacity-30"
                      }`}
                      style={
                        selected
                          ? {
                              backgroundColor: color,
                              borderColor: color,
                              color: "white",
                            }
                          : { borderColor: color, color }
                      }
                      onClick={() => available && toggleStatus(status)}
                    >
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {status}
                    </Badge>
                  );
                })}
              </div>
            </div>

            {/* Row 2: Sector (full width) */}
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5 block">
                Sector
              </label>
              <div className="flex flex-wrap gap-1.5">
                {uniqueSectors.map((sector) => {
                  const SectorIcon = getSectorIcon(sector);
                  const color = getSectorColor(sector);
                  const selected = selectedSectors.includes(sector);
                  const available = availableSectors.has(sector);
                  return (
                    <Badge
                      key={sector}
                      variant={selected ? "default" : "outline"}
                      className={`text-xs font-medium ${
                        available
                          ? "cursor-pointer"
                          : "cursor-not-allowed opacity-30"
                      }`}
                      style={
                        selected
                          ? {
                              backgroundColor: color,
                              borderColor: color,
                              color: "white",
                            }
                          : { borderColor: color, color }
                      }
                      onClick={() => available && toggleSector(sector)}
                    >
                      <SectorIcon className="h-3 w-3 mr-1" />
                      {sector}
                    </Badge>
                  );
                })}
              </div>
            </div>

            {/* Provincia (full width) */}
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5 block">
                Provincia
              </label>
              <div className="flex flex-wrap gap-1.5">
                {uniqueProvinces.map((province) => {
                  const selected = selectedProvinces.includes(province);
                  const available = availableProvinces.has(province);
                  return (
                    <Badge
                      key={province}
                      variant={selected ? "default" : "outline"}
                      className={`text-xs font-medium ${
                        available
                          ? "cursor-pointer"
                          : "cursor-not-allowed opacity-30"
                      }`}
                      style={
                        selected
                          ? {
                              backgroundColor: "var(--color-gov-navy, #0b2545)",
                              borderColor: "var(--color-gov-navy, #0b2545)",
                              color: "white",
                            }
                          : {}
                      }
                      onClick={() => available && toggleProvince(province)}
                    >
                      {province}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="border-t border-border pt-3 flex items-center justify-end">
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium"
              >
                <X className="h-3 w-3" />
                Limpiar filtros
              </button>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-lg border border-border/60 bg-white p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-blue-50 flex items-center justify-center">
              <Building2 className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Total Obras
              </p>
              <p className="text-xl font-bold text-gov-navy">
                {filteredObras.length.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-white p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-emerald-50 flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Presupuesto Total
              </p>
              <p className="text-xl font-bold text-gov-navy">
                {formatARS(summaryStats.totalBudget)}
              </p>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-white p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-violet-50 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4 text-violet-600" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Tasa de Finalizacion
              </p>
              <p className="text-xl font-bold text-gov-navy">
                {summaryStats.completionRate}%{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  ({summaryStats.completed.toLocaleString()})
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Obras Started vs Finished */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Obras Iniciadas por Presidente</CardTitle>
              <CardDescription>
                Cantidad de obras que comenzaron en cada periodo presidencial
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ObrasStartedChart data={obrasStarted} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Obras Finalizadas por Presidente</CardTitle>
              <CardDescription>
                Obras completadas durante cada periodo, sin importar quien las
                inicio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ObrasFinishedChart data={obrasFinished} />
            </CardContent>
          </Card>
        </div>

        {/* Yearly Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Obras Iniciadas por Año</CardTitle>
            <CardDescription>
              Linea temporal de obras publicas iniciadas cada año, coloreadas por
              periodo presidencial
            </CardDescription>
          </CardHeader>
          <CardContent>
            <YearlyTimelineChart data={yearlyTimeline} />
          </CardContent>
        </Card>

        {/* Existing Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Obras por Estado y Presidente</CardTitle>
              <CardDescription>
                Cantidad de obras segun estado por cada presidente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ObrasByPresidentChart data={obrasByPresident} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Presupuesto por Periodo Presidencial</CardTitle>
              <CardDescription>
                Inversion total en obras publicas por presidente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BudgetByPresidentChart data={budgetByPresident} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sectores por Periodo Presidencial</CardTitle>
              <CardDescription>
                Distribucion de obras por sector en cada presidencia
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SectorByPresidentChart
                data={sectorByPresident}
                sectors={allSectors}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ranking de Provincias</CardTitle>
              <CardDescription>
                Provincias ordenadas por cantidad de obras
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProvinceRankingChart data={provinceRanking} />
            </CardContent>
          </Card>
        </div>

        {/* Obras Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <CardTitle>Listado de Obras</CardTitle>
              <Badge variant="secondary" className="text-xs">
                {filteredObras.length.toLocaleString()}
              </Badge>
            </div>
            <CardDescription>
              Detalle de todas las obras publicas con los filtros aplicados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ObrasTable obras={filteredObras} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
