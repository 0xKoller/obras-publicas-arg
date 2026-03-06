"use client";

import { useMemo } from "react";
import type { Obra } from "@/lib/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const PONCHO_COLORS = [
  "#2897D4",
  "#2E7D32",
  "#F9A825",
  "#74ACDF",
  "#C62828",
  "#0B2D45",
  "#8B5CF6",
  "#F97316",
  "#06B6D4",
  "#EC4899",
];

interface ChartsProps {
  obras: Obra[];
}

export default function Charts({ obras }: ChartsProps) {
  const sectorData = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const o of obras) {
      counts[o.sector] = (counts[o.sector] || 0) + 1;
    }
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [obras]);

  const provinceData = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const o of obras) {
      counts[o.provincia] = (counts[o.provincia] || 0) + 1;
    }
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [obras]);

  if (obras.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      {/* Sector Pie Chart */}
      <div>
        <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
          Por Sector
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={sectorData}
              dataKey="count"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={70}
              innerRadius={35}
              label={({ name, percent }) =>
                `${(name as string).slice(0, 10)} ${((percent ?? 0) * 100).toFixed(0)}%`
              }
              labelLine={false}
              fontSize={9}
            >
              {sectorData.map((_, i) => (
                <Cell key={i} fill={PONCHO_COLORS[i % PONCHO_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Province Bar Chart */}
      <div>
        <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
          Top 10 Provincias
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={provinceData}
            layout="vertical"
            margin={{ left: 0, right: 10 }}
          >
            <XAxis type="number" hide />
            <YAxis
              dataKey="name"
              type="category"
              width={100}
              tick={{ fontSize: 10 }}
            />
            <Tooltip />
            <Bar dataKey="count" fill="#2897D4" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
