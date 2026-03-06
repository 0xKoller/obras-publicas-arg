import { Separator } from "@/components/ui/separator";

interface DetailSectionProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export function DetailSection({ title, children, icon }: DetailSectionProps) {
  return (
    <>
      <Separator />
      <div>
        <div className="flex items-center gap-1.5 mb-3">
          {icon}
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gov-navy">
            {title}
          </h3>
        </div>
        {children}
      </div>
    </>
  );
}

interface DetailFieldProps {
  label: string;
  value: string | number | null | undefined;
  fallback?: string;
}

export function DetailField({
  label,
  value,
  fallback = "-",
}: DetailFieldProps) {
  const displayValue =
    value !== null && value !== undefined && value !== "" ? value : fallback;

  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
        {label}
      </p>
      <p className="font-medium text-sm">{displayValue}</p>
    </div>
  );
}
