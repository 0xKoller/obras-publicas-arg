export function normalizeString(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export function buildDepartmentKey(
  provincia: string,
  departamento: string
): string {
  return `${normalizeString(provincia)}|${normalizeString(departamento)}`;
}

export function parseArgentineNumber(value: string): number {
  if (!value || value.trim() === "") return 0;
  const cleaned = value
    .replace(/\$/g, "")
    .replace(/\s/g, "")
    .replace(/\./g, "")
    .replace(/,/g, ".");
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

export function parsePercentage(value: string): number {
  if (!value || value.trim() === "") return 0;
  const cleaned = value.replace(/%/g, "").replace(/,/g, ".").trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}
