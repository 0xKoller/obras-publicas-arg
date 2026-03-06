"use client";

import { useMemo } from "react";
import type { Obra } from "@/lib/types";
import { formatARS } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
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
    },
    {
      label: "Presupuesto",
      value: formatARS(stats.totalBudget),
      icon: DollarSign,
    },
    {
      label: "Avance Promedio",
      value: `${stats.avgProgress.toFixed(1)}%`,
      icon: TrendingUp,
    },
    {
      label: "Finalizadas",
      value: stats.completed.toLocaleString(),
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {cards.map((card) => (
        <Card key={card.label} className="border-l-4 border-l-gov-celeste">
          <CardContent className="p-3">
            <div className="flex items-start gap-2">
              <card.icon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  {card.label}
                </p>
                <p className="text-lg font-bold text-gov-navy">{card.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
