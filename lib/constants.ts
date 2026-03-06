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
  "Finalizado": "#22c55e",
  "En ejecución": "#eab308",
  "En ejecucion": "#eab308",
  "En Ejecución": "#eab308",
  "En Ejecucion": "#eab308",
  Paralizada: "#ef4444",
  "En proceso de licitación": "#3b82f6",
  "En proceso de licitacion": "#3b82f6",
};

export const DEFAULT_STATUS_COLOR = "#6b7280";

export function getStatusColor(status: string): string {
  return STATUS_COLORS[status] ?? DEFAULT_STATUS_COLOR;
}

export function formatARS(amount: number): string {
  if (amount >= 1_000_000_000) {
    return `$${(amount / 1_000_000_000).toFixed(1)}B`;
  }
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)}M`;
  }
  return `$${amount.toLocaleString("es-AR")}`;
}
