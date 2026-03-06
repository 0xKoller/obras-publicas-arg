import Image from "next/image";

const CLIMATE_ICONS: Record<string, { src: string; label: string }> = {
  adaptación: {
    src: "/icons/clima/adaptacion.svg",
    label: "Adaptación al cambio climático",
  },
  mitigación: {
    src: "/icons/clima/mitigacion.svg",
    label: "Mitigación del cambio climático",
  },
};

interface ClimateActionBadgeProps {
  tag: string;
  size?: number;
}

export function ClimateActionBadge({ tag, size = 48 }: ClimateActionBadgeProps) {
  const key = tag.trim().toLowerCase();
  const icon = CLIMATE_ICONS[key];
  if (!icon) return null;

  return (
    <Image
      src={icon.src}
      alt={icon.label}
      title={icon.label}
      width={size}
      height={size}
      className="rounded-sm"
    />
  );
}
