export interface PresidentialPeriod {
  president: string;
  shortName: string;
  startYear: number;
  endYear: number;
  color: string;
  image: string;
}

export const PRESIDENTIAL_PERIODS: PresidentialPeriod[] = [
  {
    president: "Nestor Kirchner",
    shortName: "Kirchner",
    startYear: 2003,
    endYear: 2006,
    color: "#2897D4",
    image: "/presidents/kirchner.jpg",
  },
  {
    president: "Cristina Fernandez de Kirchner",
    shortName: "CFK",
    startYear: 2007,
    endYear: 2014,
    color: "#2E7D32",
    image: "/presidents/cfk.jpg",
  },
  {
    president: "Mauricio Macri",
    shortName: "Macri",
    startYear: 2015,
    endYear: 2018,
    color: "#F9A825",
    image: "/presidents/macri.jpg",
  },
  {
    president: "Alberto Fernandez",
    shortName: "A. Fernandez",
    startYear: 2019,
    endYear: 2022,
    color: "#74ACDF",
    image: "/presidents/afernandez.jpg",
  },
  {
    president: "Javier Milei",
    shortName: "Milei",
    startYear: 2023,
    endYear: 9999,
    color: "#8B5CF6",
    image: "/presidents/milei.jpg",
  },
];

export function getPresidentialPeriod(
  yearStr: string
): PresidentialPeriod | null {
  const year = parseInt(yearStr, 10);
  if (isNaN(year)) return null;
  return (
    PRESIDENTIAL_PERIODS.find(
      (p) => year >= p.startYear && year <= p.endYear
    ) ?? null
  );
}
