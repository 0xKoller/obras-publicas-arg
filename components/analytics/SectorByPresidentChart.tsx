"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getSectorColor } from "@/lib/constants";

interface Props {
  data: Record<string, string | number>[];
  sectors: string[];
}

export default function SectorByPresidentChart({ data, sectors }: Props) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        {sectors.map((sector) => (
          <Bar
            key={sector}
            dataKey={sector}
            stackId="sectors"
            fill={getSectorColor(sector)}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
