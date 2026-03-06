import Image from "next/image";

const ODS_TITLES: Record<number, string> = {
  1: "Fin de la pobreza",
  2: "Hambre cero",
  3: "Salud y bienestar",
  4: "Educacion de calidad",
  5: "Igualdad de genero",
  6: "Agua limpia y saneamiento",
  7: "Energia asequible y no contaminante",
  8: "Trabajo decente y crecimiento economico",
  9: "Industria, innovacion e infraestructura",
  10: "Reduccion de las desigualdades",
  11: "Ciudades y comunidades sostenibles",
  12: "Produccion y consumo responsables",
  13: "Accion por el clima",
  14: "Vida submarina",
  15: "Vida de ecosistemas terrestres",
  16: "Paz, justicia e instituciones solidas",
  17: "Alianzas para lograr los objetivos",
};

interface OdsBadgeProps {
  tag: string;
  size?: number;
}

export function OdsBadge({ tag, size = 48 }: OdsBadgeProps) {
  const match = tag.match(/ODS (\d+)/);
  if (!match) return null;

  const goalNumber = parseInt(match[1], 10);
  if (goalNumber < 1 || goalNumber > 17) return null;

  const paddedNumber = String(goalNumber).padStart(2, "0");
  const title = ODS_TITLES[goalNumber] ?? tag;

  return (
    <Image
      src={`/icons/ods/ods-${paddedNumber}.png`}
      alt={`ODS ${goalNumber}: ${title}`}
      title={`ODS ${goalNumber}: ${title}`}
      width={size}
      height={size}
      className="rounded-sm"
    />
  );
}
