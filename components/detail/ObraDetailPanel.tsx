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
  Link,
  Check,
} from "lucide-react";
import { useState } from "react";
import ImageGallery from "./ImageGallery";
import { DetailSection, DetailField } from "./DetailSection";
import { OdsBadge } from "./OdsBadge";
import { ClimateActionBadge } from "./ClimateActionBadge";
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
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        className="h-2.5 bg-muted rounded-full overflow-hidden"
      >
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


function ShareButtons({ obra }: { obra: Obra }) {
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/?obra=${obra.id}`
      : "";

  const twitterText = [
    obra.nombre,
    `${obra.provincia} | ${obra.etapa}`,
    `Avance: ${obra.avanceFisico.toFixed(0)}% | ${formatARS(obra.montoTotal)}`,
  ].join("\n");

  const whatsappText = [
    `*${obra.nombre}*`,
    ``,
    `*Ubicacion:* ${obra.provincia}${obra.departamento ? `, ${obra.departamento}` : ""}`,
    `*Estado:* ${obra.etapa}`,
    `*Avance fisico:* ${obra.avanceFisico.toFixed(0)}% | *Financiero:* ${obra.avanceFinanciero.toFixed(0)}%`,
    `*Monto:* ${formatARS(obra.montoTotal)}`,
    ...(obra.descripcion ? [``, obra.descripcion] : []),
    ``,
    shareUrl,
  ].join("\n");

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-1 mt-2">
      <button
        onClick={handleCopy}
        className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        title="Copiar enlace"
        aria-label="Copiar enlace"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5" />
        ) : (
          <Link className="h-3.5 w-3.5" />
        )}
        {copied ? "Copiado!" : "Copiar"}
      </button>
      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(twitterText)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        title="Compartir en X"
        aria-label="Compartir en X (Twitter)"
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </a>
      <a
        href={`https://wa.me/?text=${encodeURIComponent(whatsappText)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        title="Compartir en WhatsApp"
        aria-label="Compartir en WhatsApp"
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );
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
              <div className="flex items-center justify-between mt-2">
                <Badge
                  className="text-white border-white/30"
                  style={{ backgroundColor: getStatusColor(obra.etapa) }}
                >
                  {obra.etapa}
                </Badge>
                <ShareButtons obra={obra} />
              </div>
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
                      <div className="flex flex-wrap gap-2">
                        {obra.tagAccionClimatica.map((tag) => (
                          <ClimateActionBadge key={tag} tag={tag} />
                        ))}
                      </div>
                    </div>
                  )}
                  {obra.tagOdsIncidencia.length > 0 && (
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1.5">
                        Objetivos de Desarrollo Sostenible
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {obra.tagOdsIncidencia.map((tag) => (
                          <OdsBadge key={tag} tag={tag} />
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
