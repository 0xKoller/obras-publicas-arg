export const ARGENTINA_CENTER: [number, number] = [-38.4161, -63.6167];
export const DEFAULT_ZOOM = 4;

export const ARGENTINA_BOUNDS: [[number, number], [number, number]] = [
  [-57, -76],
  [-20, -52],
];
export const MIN_ZOOM = 4;
export const MAX_ZOOM = 18;
export const MAX_BOUNDS_VISCOSITY = 1.0;

export const TILE_URL =
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
export const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

export const STATUS_COLORS: Record<string, string> = {
  Finalizada: "#22c55e",
  Finalizado: "#22c55e",
  FINALIZADAS: "#22c55e",
  "En ejecución": "#eab308",
  "En ejecucion": "#eab308",
  "En Ejecución": "#eab308",
  "En Ejecucion": "#eab308",
  "EN EJECUCIÓN": "#eab308",
  Paralizada: "#ef4444",
  OTRAS: "#6b7280",
  "En proceso de licitación": "#3b82f6",
  "En proceso de licitacion": "#3b82f6",
};

export const DEFAULT_STATUS_COLOR = "#6b7280";

export function getStatusColor(status: string): string {
  return STATUS_COLORS[status] ?? DEFAULT_STATUS_COLOR;
}

import type { LucideIcon } from "lucide-react";
import {
  HardHat,
  CheckCircle2,
  CirclePause,
  FileText,
  Circle,
  Droplets,
  Building2,
  GraduationCap,
  Landmark,
  Route,
  Ellipsis,
  Waves,
  HeartPulse,
  Home,
} from "lucide-react";

// --- Status icons ---
const STATUS_ICONS: Record<string, LucideIcon> = {
  Finalizada: CheckCircle2,
  Finalizado: CheckCircle2,
  FINALIZADAS: CheckCircle2,
  "En ejecución": HardHat,
  "En ejecucion": HardHat,
  "En Ejecución": HardHat,
  "En Ejecucion": HardHat,
  "EN EJECUCIÓN": HardHat,
  Paralizada: CirclePause,
  OTRAS: Circle,
  "En proceso de licitación": FileText,
  "En proceso de licitacion": FileText,
};

const DEFAULT_STATUS_ICON = Circle;

export function getStatusIcon(status: string): LucideIcon {
  return STATUS_ICONS[status] ?? DEFAULT_STATUS_ICON;
}

// --- Sector icons ---
const SECTOR_ICONS: Record<string, LucideIcon> = {
  "Agua y Cloaca": Droplets,
  "Agua Y Cloaca": Droplets,
  "AGUA Y CLOACA": Droplets,
  Arquitectura: Building2,
  ARQUITECTURA: Building2,
  "Educación": GraduationCap,
  "Educacion": GraduationCap,
  EDUCACION: GraduationCap,
  "Equipamiento Urbano": Landmark,
  "EQUIPAMIENTO URBANO": Landmark,
  "Obras Viales": Route,
  "OBRAS VIALES": Route,
  Otros: Ellipsis,
  OTROS: Ellipsis,
  "Recursos Hidricos": Waves,
  "Recursos Hídricos": Waves,
  "RECURSOS HIDRICOS": Waves,
  Salud: HeartPulse,
  SALUD: HeartPulse,
  "Vivienda / Hábitat": Home,
  "Vivienda / Habitat": Home,
  "VIVIENDA / HABITAT": Home,
};

const DEFAULT_SECTOR_ICON = Building2;

export function getSectorIcon(sector: string): LucideIcon {
  return SECTOR_ICONS[sector] ?? DEFAULT_SECTOR_ICON;
}

// --- Sector colors ---
const SECTOR_COLORS: Record<string, string> = {
  "Agua y Cloaca": "#3b82f6",
  Arquitectura: "#64748b",
  "Educación": "#8b5cf6",
  "Equipamiento Urbano": "#f59e0b",
  "Obras Viales": "#78716c",
  Otros: "#6b7280",
  "Recursos Hidricos": "#06b6d4",
  Salud: "#f43f5e",
  "Vivienda / Hábitat": "#10b981",
};

const DEFAULT_SECTOR_COLOR = "#6b7280";

export function getSectorColor(sector: string): string {
  if (SECTOR_COLORS[sector]) return SECTOR_COLORS[sector];
  const key = Object.keys(SECTOR_COLORS).find(
    (k) => k.toLowerCase() === sector.toLowerCase()
  );
  return key ? SECTOR_COLORS[key] : DEFAULT_SECTOR_COLOR;
}

// --- Sector SVGs for Leaflet map markers ---
const SECTOR_SVGS: Record<string, string> = {
  "Agua y Cloaca": `<path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/>`,
  Arquitectura: `<path d="M10 12h4"/><path d="M10 8h4"/><path d="M14 21v-3a2 2 0 0 0-4 0v3"/><path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2"/><path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"/>`,
  "Educación": `<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>`,
  "Equipamiento Urbano": `<path d="M10 18v-7"/><path d="M11.12 2.198a2 2 0 0 1 1.76.006l7.866 3.847c.476.233.31.949-.22.949H3.474c-.53 0-.695-.716-.22-.949z"/><path d="M14 18v-7"/><path d="M18 18v-7"/><path d="M3 22h18"/><path d="M6 18v-7"/>`,
  "Obras Viales": `<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>`,
  Otros: `<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>`,
  "Recursos Hidricos": `<path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>`,
  Salud: `<path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/><path d="M3.22 13H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>`,
  "Vivienda / Hábitat": `<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>`,
};

const DEFAULT_SECTOR_SVG = `<path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/><path d="M9 9v.01"/><path d="M9 12v.01"/><path d="M9 15v.01"/><path d="M9 18v.01"/>`;

export function getSectorSvg(sector: string): string {
  // Try exact match first, then case-insensitive
  if (SECTOR_SVGS[sector]) return SECTOR_SVGS[sector];
  const key = Object.keys(SECTOR_SVGS).find(
    (k) => k.toLowerCase() === sector.toLowerCase()
  );
  return key ? SECTOR_SVGS[key] : DEFAULT_SECTOR_SVG;
}

export function formatARS(amount: number): string {
  if (amount >= 1_000_000_000_000) {
    return `$${(amount / 1_000_000_000_000).toFixed(1)}T`;
  }
  if (amount >= 1_000_000_000) {
    return `$${(amount / 1_000_000_000).toFixed(1)}B`;
  }
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)}M`;
  }
  return `$${amount.toLocaleString("es-AR")}`;
}
