import L from "leaflet";
import { getSectorSvg } from "@/lib/constants";

function makeSvg(innerPaths: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="obra-marker-icon">${innerPaths}</svg>`;
}

export function createObraIcon(statusColor: string, sector?: string): L.DivIcon {
  const svg = makeSvg(getSectorSvg(sector ?? ""));
  return L.divIcon({
    className: "obra-marker",
    html: `<div class="obra-marker-inner" style="background-color:${statusColor}">${svg}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
  });
}

export function createClusterIcon(cluster: { getChildCount(): number }): L.DivIcon {
  const count = cluster.getChildCount();

  let size: number;
  let sizeClass: string;

  if (count < 10) {
    size = 36;
    sizeClass = "cluster-small";
  } else if (count < 100) {
    size = 44;
    sizeClass = "cluster-medium";
  } else {
    size = 52;
    sizeClass = "cluster-large";
  }

  return L.divIcon({
    className: "obra-cluster",
    html: `<div class="obra-cluster-inner ${sizeClass}"><span>${count}</span></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}
