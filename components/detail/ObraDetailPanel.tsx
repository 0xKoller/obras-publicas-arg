"use client";

import type { Obra } from "@/lib/types";
import { getStatusColor, formatARS } from "@/lib/constants";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ExternalLink } from "lucide-react";

interface ObraDetailPanelProps {
  obra: Obra | null;
  onClose: () => void;
}

function ProgressBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-muted-foreground uppercase tracking-wider font-medium">
          {label}
        </span>
        <span className="font-bold text-gov-navy">{value.toFixed(1)}%</span>
      </div>
      <div className="h-2.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${Math.min(100, value)}%`,
            backgroundColor: value >= 100 ? "#2E7D32" : "#2897D4",
          }}
        />
      </div>
    </div>
  );
}

export default function ObraDetailPanel({
  obra,
  onClose,
}: ObraDetailPanelProps) {
  return (
    <Sheet open={!!obra} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="overflow-y-auto w-[400px] sm:w-[450px] p-0">
        {obra && (
          <>
            {/* Navy header */}
            <div className="bg-gov-navy px-6 py-4">
              <SheetHeader>
                <SheetTitle className="text-left text-base leading-tight text-white">
                  {obra.nombre}
                </SheetTitle>
              </SheetHeader>
              <Badge
                className="mt-2 text-white border-white/30"
                style={{ backgroundColor: getStatusColor(obra.etapa) }}
              >
                {obra.etapa}
              </Badge>
            </div>

            <div className="px-6 py-4 flex flex-col gap-4">
              {obra.descripcion && (
                <p className="text-sm text-muted-foreground">
                  {obra.descripcion}
                </p>
              )}

              <Separator />

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                    Monto Total
                  </p>
                  <p className="font-semibold text-gov-navy">
                    {formatARS(obra.montoTotal)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                    Moneda
                  </p>
                  <p className="font-medium">{obra.moneda}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                    Provincia
                  </p>
                  <p className="font-medium">{obra.provincia}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                    Departamento
                  </p>
                  <p className="font-medium">{obra.departamento}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                    Sector
                  </p>
                  <p className="font-medium">{obra.sector}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                    Tipo
                  </p>
                  <p className="font-medium">{obra.tipo || "-"}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                    Inicio
                  </p>
                  <p className="font-medium">{obra.fechaInicio || "-"}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                    Fin
                  </p>
                  <p className="font-medium">{obra.fechaFin || "-"}</p>
                </div>
              </div>

              <Separator />

              <ProgressBar label="Avance Fisico" value={obra.avanceFisico} />
              <ProgressBar
                label="Avance Financiero"
                value={obra.avanceFinanciero}
              />

              {obra.programa && (
                <>
                  <Separator />
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                      Programa
                    </p>
                    <p className="text-sm">{obra.programa}</p>
                  </div>
                </>
              )}

              {obra.ejecutor && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                    Ejecutor
                  </p>
                  <p className="text-sm">{obra.ejecutor}</p>
                </div>
              )}

              {obra.urlPerfil && (
                <>
                  <Separator />
                  <a
                    href={obra.urlPerfil}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-medium"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Ver perfil de la obra
                  </a>
                </>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
