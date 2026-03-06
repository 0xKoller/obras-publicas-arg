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
import {
  ExternalLink,
  MapPin,
  Building2,
  Banknote,
  Users,
  Leaf,
  Target,
  Calendar,
} from "lucide-react";
import ImageGallery from "./ImageGallery";
import { DetailSection, DetailField } from "./DetailSection";
import { useObraImages } from "@/hooks/use-obra-images";

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

function formatDuration(days: number): string {
  if (days <= 0) return "-";
  if (days < 30) return `${days} dias`;
  const months = Math.round(days / 30);
  if (months < 12) return `${months} meses (~${days} dias)`;
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (remainingMonths === 0)
    return `${years} año${years > 1 ? "s" : ""}`;
  return `${years}a ${remainingMonths}m (~${days} dias)`;
}

const ODS_COLORS: Record<string, string> = {
  "ODS 1": "#E5243B",
  "ODS 2": "#DDA63A",
  "ODS 3": "#4C9F38",
  "ODS 4": "#C5192D",
  "ODS 5": "#FF3A21",
  "ODS 6": "#26BDE2",
  "ODS 7": "#FCC30B",
  "ODS 8": "#A21942",
  "ODS 9": "#FD6925",
  "ODS 10": "#DD1367",
  "ODS 11": "#FD9D24",
  "ODS 12": "#BF8B2E",
  "ODS 13": "#3F7E44",
  "ODS 14": "#0A97D9",
  "ODS 15": "#56C02B",
  "ODS 16": "#00689D",
  "ODS 17": "#19486A",
};

function getOdsColor(tag: string): string {
  const odsNumber = tag.match(/ODS \d+/)?.[0];
  return odsNumber ? ODS_COLORS[odsNumber] || "#6b7280" : "#6b7280";
}

export default function ObraDetailPanel({
  obra,
  onClose,
}: ObraDetailPanelProps) {
  const { images, loading: imagesLoading } = useObraImages(obra?.id ?? null);

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
              {/* Image Gallery */}
              <ImageGallery images={images} loading={imagesLoading} />

              {/* Description */}
              {obra.descripcion && (
                <p className="text-sm text-muted-foreground">
                  {obra.descripcion}
                </p>
              )}

              {/* Objective (only if different from description) */}
              {obra.objetivoGeneral &&
                obra.objetivoGeneral !== obra.descripcion && (
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                      Objetivo General
                    </p>
                    <p className="text-sm">{obra.objetivoGeneral}</p>
                  </div>
                )}

              {/* Key Metrics */}
              <DetailSection
                title="Presupuesto y Avance"
                icon={
                  <Banknote className="h-3.5 w-3.5 text-gov-navy" />
                }
              >
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                      Monto Total
                    </p>
                    <p className="font-semibold text-gov-navy">
                      {formatARS(obra.montoTotal)}
                    </p>
                  </div>
                  <DetailField label="Moneda" value={obra.moneda} />
                  <DetailField
                    label="Inicio"
                    value={obra.fechaInicio}
                  />
                  <DetailField label="Fin" value={obra.fechaFin} />
                  {obra.duracionDias > 0 && (
                    <DetailField
                      label="Duracion"
                      value={formatDuration(obra.duracionDias)}
                    />
                  )}
                </div>
                <div className="mt-3 space-y-3">
                  <ProgressBar
                    label="Avance Fisico"
                    value={obra.avanceFisico}
                  />
                  <ProgressBar
                    label="Avance Financiero"
                    value={obra.avanceFinanciero}
                  />
                </div>
              </DetailSection>

              {/* Location */}
              <DetailSection
                title="Ubicacion"
                icon={
                  <MapPin className="h-3.5 w-3.5 text-gov-navy" />
                }
              >
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <DetailField
                    label="Provincia"
                    value={obra.provincia}
                  />
                  <DetailField
                    label="Departamento"
                    value={obra.departamento}
                  />
                </div>
              </DetailSection>

              {/* Project Details */}
              <DetailSection
                title="Detalles del Proyecto"
                icon={
                  <Building2 className="h-3.5 w-3.5 text-gov-navy" />
                }
              >
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <DetailField label="Tipo" value={obra.tipo} />
                  <DetailField label="Sector" value={obra.sector} />
                  {obra.numeroObra && (
                    <DetailField
                      label="N. Obra"
                      value={obra.numeroObra}
                    />
                  )}
                  {obra.codigoBapin && (
                    <DetailField
                      label="Cod. BAPIN"
                      value={obra.codigoBapin}
                    />
                  )}
                  {obra.codigoBahra && (
                    <DetailField
                      label="Cod. BAHRA"
                      value={obra.codigoBahra}
                    />
                  )}
                </div>
              </DetailSection>

              {/* Funding */}
              {(obra.financiador1 ||
                obra.financiador2 ||
                obra.financiadorPrestamo) && (
                <DetailSection
                  title="Financiamiento"
                  icon={
                    <Banknote className="h-3.5 w-3.5 text-gov-navy" />
                  }
                >
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    {obra.financiador1 && (
                      <DetailField
                        label="Organismo Financiador 1"
                        value={obra.financiador1}
                      />
                    )}
                    {obra.financiador2 && (
                      <DetailField
                        label="Organismo Financiador 2"
                        value={obra.financiador2}
                      />
                    )}
                    {obra.financiadorPrestamo && (
                      <DetailField
                        label="Prestamo"
                        value={obra.financiadorPrestamo}
                      />
                    )}
                  </div>
                </DetailSection>
              )}

              {/* Counterpart */}
              {(obra.contraparteKey ||
                obra.contraparteVal ||
                obra.contraparteCuit) && (
                <DetailSection
                  title="Contraparte"
                  icon={
                    <Users className="h-3.5 w-3.5 text-gov-navy" />
                  }
                >
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {obra.contraparteKey && (
                      <DetailField
                        label="Contraparte"
                        value={obra.contraparteKey}
                      />
                    )}
                    {obra.contraparteVal && (
                      <DetailField
                        label="Valor"
                        value={obra.contraparteVal}
                      />
                    )}
                    {obra.contraparteCuit && (
                      <DetailField
                        label="CUIT"
                        value={obra.contraparteCuit}
                      />
                    )}
                    {obra.contraparteModalidad && (
                      <DetailField
                        label="Modalidad"
                        value={obra.contraparteModalidad}
                      />
                    )}
                  </div>
                </DetailSection>
              )}

              {/* Program & Executor */}
              {(obra.programa || obra.ejecutor) && (
                <DetailSection
                  title="Ejecucion"
                  icon={
                    <Target className="h-3.5 w-3.5 text-gov-navy" />
                  }
                >
                  <div className="space-y-2">
                    {obra.programa && (
                      <DetailField
                        label="Programa"
                        value={obra.programa}
                      />
                    )}
                    {obra.ejecutor && (
                      <DetailField
                        label="Entidad Ejecutora"
                        value={obra.ejecutor}
                      />
                    )}
                  </div>
                </DetailSection>
              )}

              {/* Tags */}
              {(obra.tagAccionClimatica.length > 0 ||
                obra.tagOdsIncidencia.length > 0) && (
                <DetailSection
                  title="Etiquetas"
                  icon={
                    <Leaf className="h-3.5 w-3.5 text-gov-navy" />
                  }
                >
                  {obra.tagAccionClimatica.length > 0 && (
                    <div className="mb-2">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1.5">
                        Accion Climatica
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {obra.tagAccionClimatica.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-[10px] border-green-300 text-green-700 bg-green-50"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {obra.tagOdsIncidencia.length > 0 && (
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1.5">
                        Objetivos de Desarrollo Sostenible
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {obra.tagOdsIncidencia.map((tag) => (
                          <Badge
                            key={tag}
                            className="text-[10px] text-white"
                            style={{
                              backgroundColor: getOdsColor(tag),
                            }}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </DetailSection>
              )}

              {/* External Link */}
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
