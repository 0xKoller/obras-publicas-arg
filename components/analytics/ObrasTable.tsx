"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Obra } from "@/lib/types";
import { getStatusColor } from "@/lib/constants";
import { formatARS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  MapPin,
  ExternalLink,
} from "lucide-react";

interface Props {
  obras: Obra[];
}

type SortKey =
  | "nombre"
  | "provincia"
  | "sector"
  | "etapa"
  | "montoTotal"
  | "fechaInicio"
  | "fechaFin"
  | "avanceFisico";

type SortDir = "asc" | "desc";

const PAGE_SIZE = 20;

const COLUMNS: { key: SortKey; label: string; align?: "right" | "center"; width?: string }[] = [
  { key: "nombre", label: "Nombre", width: "w-[28%]" },
  { key: "provincia", label: "Provincia", width: "w-[11%]" },
  { key: "sector", label: "Sector", width: "w-[12%]" },
  { key: "etapa", label: "Estado", width: "w-[10%]" },
  { key: "montoTotal", label: "Presupuesto", align: "right", width: "w-[11%]" },
  { key: "fechaInicio", label: "Inicio", align: "center", width: "w-[7%]" },
  { key: "fechaFin", label: "Fin", align: "center", width: "w-[7%]" },
  { key: "avanceFisico", label: "Avance", align: "right", width: "w-[8%]" },
];

function compare(a: Obra, b: Obra, key: SortKey): number {
  switch (key) {
    case "montoTotal":
    case "avanceFisico":
      return a[key] - b[key];
    case "fechaInicio":
    case "fechaFin": {
      const na = parseInt(a[key], 10) || 0;
      const nb = parseInt(b[key], 10) || 0;
      return na - nb;
    }
    default:
      return (a[key] || "").localeCompare(b[key] || "", "es");
  }
}

export default function ObrasTable({ obras }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      if (sortDir === "asc") {
        setSortDir("desc");
      } else {
        setSortKey(null);
        setSortDir("asc");
      }
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setCurrentPage(1);
  };

  const sortedObras = useMemo(() => {
    if (!sortKey) return obras;
    const sorted = [...obras].sort((a, b) => compare(a, b, sortKey));
    return sortDir === "desc" ? sorted.reverse() : sorted;
  }, [obras, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sortedObras.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const start = (safeCurrentPage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const pageObras = sortedObras.slice(start, end);

  if (safeCurrentPage !== currentPage) {
    setCurrentPage(safeCurrentPage);
  }

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column)
      return <ArrowUpDown className="h-3 w-3 text-muted-foreground/50" />;
    return sortDir === "asc" ? (
      <ArrowUp className="h-3 w-3" />
    ) : (
      <ArrowDown className="h-3 w-3" />
    );
  };

  return (
    <div>
      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            {COLUMNS.map((col) => (
              <TableHead
                key={col.key}
                className={`cursor-pointer select-none hover:text-foreground ${col.width || ""} ${
                  col.align === "right"
                    ? "text-right"
                    : col.align === "center"
                      ? "text-center"
                      : ""
                }`}
                onClick={() => handleSort(col.key)}
              >
                <span className="inline-flex items-center gap-1">
                  {col.label}
                  <SortIcon column={col.key} />
                </span>
              </TableHead>
            ))}
            <TableHead className="w-[6%]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageObras.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={9}
                className="text-center text-muted-foreground py-8"
              >
                No se encontraron obras con los filtros seleccionados
              </TableCell>
            </TableRow>
          ) : (
            pageObras.map((obra) => (
              <TableRow key={obra.id}>
                <TableCell className="font-medium overflow-hidden">
                  <div className="truncate" title={obra.nombre}>
                    {obra.nombre}
                  </div>
                </TableCell>
                <TableCell className="overflow-hidden">
                  <div className="truncate" title={obra.provincia}>{obra.provincia}</div>
                </TableCell>
                <TableCell className="overflow-hidden">
                  <div className="truncate" title={obra.sector}>{obra.sector}</div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="text-xs"
                    style={{
                      borderColor: getStatusColor(obra.etapa),
                      color: getStatusColor(obra.etapa),
                    }}
                  >
                    {obra.etapa}
                  </Badge>
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatARS(obra.montoTotal)}
                </TableCell>
                <TableCell className="text-center tabular-nums">
                  {obra.fechaInicio || "—"}
                </TableCell>
                <TableCell className="text-center tabular-nums">
                  {obra.fechaFin || "—"}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {obra.avanceFisico}%
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/?obra=${obra.id}`}
                      title="Ver en mapa"
                      className="inline-flex items-center justify-center h-7 w-7 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <MapPin className="h-3.5 w-3.5" />
                    </Link>
                    {obra.urlPerfil && (
                      <a
                        href={obra.urlPerfil}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Ver pagina oficial"
                        className="inline-flex items-center justify-center h-7 w-7 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {sortedObras.length > PAGE_SIZE && (
        <div className="flex items-center justify-between pt-4 border-t mt-4">
          <p className="text-sm text-muted-foreground">
            Mostrando {start + 1}–{Math.min(end, sortedObras.length)} de{" "}
            {sortedObras.length.toLocaleString()} obras
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safeCurrentPage <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            <span className="text-sm text-muted-foreground">
              {safeCurrentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
              disabled={safeCurrentPage >= totalPages}
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
