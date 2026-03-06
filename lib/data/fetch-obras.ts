import Papa from "papaparse";
import departmentsData from "./departments.json";
import {
  buildDepartmentKey,
  parseArgentineNumber,
  parsePercentage,
} from "../geocode";
import type { Obra, ObraRaw, DepartmentLookup } from "../types";

const CSV_URL =
  "https://mapainversiones.obraspublicas.gob.ar/opendata/dataset_mop.csv";

function normalizeEtapa(raw: string | undefined): string {
  if (!raw || raw.trim() === "") return "Otras";
  const lower = raw.trim().toLowerCase();
  if (lower === "finalizada" || lower === "finalizado" || lower === "finalizadas")
    return "Finalizada";
  if (lower.includes("ejecuci") || lower.includes("ejecucion"))
    return "En ejecución";
  if (lower === "paralizada") return "Paralizada";
  if (lower.includes("licitaci") || lower.includes("licitacion"))
    return "En proceso de licitación";
  return "Otras";
}

function cleanDashValue(value: string): string {
  if (!value || value.trim() === "-" || value.trim() === "") return "";
  return value.trim();
}

function parsePipeSeparatedTags(value: string): string[] {
  if (!value || value.trim() === "" || value.trim() === "-") return [];
  return value
    .split("|")
    .map((t) => t.trim())
    .filter(Boolean);
}

let cachedObras: Obra[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

function mapRawToObra(
  raw: ObraRaw,
  lookup: DepartmentLookup
): Obra | null {
  const key = buildDepartmentKey(
    raw.nombreprovincia || "",
    raw.nombredepto || ""
  );
  const centroid = lookup[key];
  if (!centroid) return null;

  return {
    id: raw.idproyecto,
    nombre: raw.nombreobra || "Sin nombre",
    descripcion: raw.descripicionfisica || "",
    montoTotal: parseArgentineNumber(raw.montototal),
    sector: raw.sectornombre || "Otro",
    avanceFisico: parsePercentage(raw.avancefisico),
    avanceFinanciero: parsePercentage(raw.avancefinanciero),
    departamento: raw.nombredepto || "",
    provincia: raw.nombreprovincia || "",
    etapa: normalizeEtapa(raw.etapaobra),
    tipo: raw.tipoproyecto || "",
    urlPerfil: raw.url_perfil_obra || "",
    fechaInicio: raw.fechainicioanio || "",
    fechaFin: raw.fechafinanio || "",
    programa: raw.programa_infraestructura || "",
    ejecutor: raw.entidadejecutoranombre || "",
    moneda: raw.tipomoneda || "ARS",
    numeroObra: cleanDashValue(raw.numeroobra),
    codigoBapin: cleanDashValue(raw.codigobapin),
    duracionDias: parseInt(raw.duracionobrasdias || "0", 10) || 0,
    objetivoGeneral: raw.objetivogeneral || "",
    codigoBahra: cleanDashValue(raw.codigo_bahra),
    financiador1: cleanDashValue(raw.organismo_financiador_1),
    financiador2: cleanDashValue(raw.organismo_financiador_2),
    financiadorPrestamo: cleanDashValue(raw.organismo_financiador_prestamo),
    contraparteKey: cleanDashValue(raw.contraparte_key),
    contraparteVal: cleanDashValue(raw.contraparte_val),
    contraparteCuit: cleanDashValue(raw.contraparte_cuit),
    contraparteModalidad: cleanDashValue(raw.contraparte_modalidad),
    tagAccionClimatica: parsePipeSeparatedTags(raw.tag_accionclimatica),
    tagOdsIncidencia: parsePipeSeparatedTags(raw.tag_ods_incidencia),
    lat: centroid.lat,
    lng: centroid.lng,
  };
}

export async function fetchObras(): Promise<Obra[]> {
  const now = Date.now();
  if (cachedObras && now - cacheTimestamp < CACHE_TTL) {
    return cachedObras;
  }

  const res = await fetch(CSV_URL);
  if (!res.ok) throw new Error(`Failed to fetch CSV: ${res.status}`);

  const csvText = await res.text();
  const lookup = departmentsData as DepartmentLookup;

  const { data } = Papa.parse<ObraRaw>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  const obras: Obra[] = [];
  let unmatched = 0;

  for (const raw of data) {
    const obra = mapRawToObra(raw, lookup);
    if (obra) {
      obras.push(obra);
    } else {
      unmatched++;
    }
  }

  console.log(
    `[fetch-obras] Parsed ${data.length} rows, geocoded ${obras.length}, unmatched ${unmatched}`
  );

  cachedObras = obras;
  cacheTimestamp = now;
  return obras;
}
