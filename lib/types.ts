export interface ObraRaw {
  idproyecto: string;
  nombreobra: string;
  descripicionfisica: string;
  montototal: string;
  sectornombre: string;
  avancefinanciero: string;
  avancefisico: string;
  nombredepto: string;
  nombreprovincia: string;
  etapaobra: string;
  tipoproyecto: string;
  url_perfil_obra: string;
  fechainicioanio: string;
  fechafinanio: string;
  programa_infraestructura: string;
  entidadejecutoranombre: string;
  tipomoneda: string;
  numeroobra: string;
  codigobapin: string;
  duracionobrasdias: string;
  objetivogeneral: string;
  codigo_bahra: string;
  organismo_financiador_1: string;
  organismo_financiador_2: string;
  organismo_financiador_prestamo: string;
  contraparte_key: string;
  contraparte_val: string;
  contraparte_cuit: string;
  contraparte_modalidad: string;
  tag_accionclimatica: string;
  tag_ods_incidencia: string;
}

export interface Obra {
  id: string;
  nombre: string;
  descripcion: string;
  montoTotal: number;
  sector: string;
  avanceFisico: number;
  avanceFinanciero: number;
  departamento: string;
  provincia: string;
  etapa: string;
  tipo: string;
  urlPerfil: string;
  fechaInicio: string;
  fechaFin: string;
  programa: string;
  ejecutor: string;
  moneda: string;
  numeroObra: string;
  codigoBapin: string;
  duracionDias: number;
  objetivoGeneral: string;
  codigoBahra: string;
  financiador1: string;
  financiador2: string;
  financiadorPrestamo: string;
  contraparteKey: string;
  contraparteVal: string;
  contraparteCuit: string;
  contraparteModalidad: string;
  tagAccionClimatica: string[];
  tagOdsIncidencia: string[];
  lat: number;
  lng: number;
}

export interface ObraImage {
  url: string;
  description: string;
}

export interface DepartmentCentroid {
  lat: number;
  lng: number;
}

export type DepartmentLookup = Record<string, DepartmentCentroid>;

export interface FilterState {
  province: string | null;
  sectors: string[];
  statuses: string[];
  searchQuery: string;
  yearRange: [number, number] | null;
}

export interface StatsData {
  totalObras: number;
  totalBudget: number;
  avgPhysicalProgress: number;
  completedCount: number;
  inProgressCount: number;
}
