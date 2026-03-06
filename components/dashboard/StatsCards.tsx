"use client";

import { useMemo } from "react";
import type { Obra } from "@/lib/types";
import { formatARS } from "@/lib/constants";
import { Building2, DollarSign, TrendingUp, CheckCircle2 } from "lucide-react";

interface StatsCardsProps {
  obras: Obra[];
}

export default function StatsCards({ obras }: StatsCardsProps) {
  const stats = useMemo(() => {
    const totalBudget = obras.reduce((sum, o) => sum + o.montoTotal, 0);
    const avgProgress =
      obras.length > 0
        ? obras.reduce((sum, o) => sum + o.avanceFisico, 0) / obras.length
        : 0;
    const completed = obras.filter(
      (o) => o.etapa === "Finalizada" || o.etapa === "Finalizado"
    ).length;

    return { totalBudget, avgProgress, completed };
  }, [obras]);

  const cards = [
    {
      label: "Total Obras",
      value: obras.length.toLocaleString(),
      icon: Building2,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      label: "Presupuesto",
      value: formatARS(stats.totalBudget),
      icon: DollarSign,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      label: "Avance Promedio",
      value: `${stats.avgProgress.toFixed(1)}%`,
      icon: TrendingUp,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      label: "Finalizadas",
      value: stats.completed.toLocaleString(),
      icon: CheckCircle2,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-lg border border-border/60 bg-white p-3 flex flex-col gap-2"
        >
          <div className={`w-7 h-7 rounded-md ${card.iconBg} flex items-center justify-center`}>
            <card.icon className={`h-3.5 w-3.5 ${card.iconColor}`} />
          </div>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground leading-tight">
              {card.label}
            </p>
            <p className="text-lg font-bold text-gov-navy leading-tight mt-0.5">
              {card.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
