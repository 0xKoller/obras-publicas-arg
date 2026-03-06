"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface DataItem {
  year: number;
  count: number;
  color: string;
}

interface Props {
  data: DataItem[];
}

export default function YearlyTimelineChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <XAxis
          dataKey="year"
          tick={{ fontSize: 11 }}
          tickFormatter={(value) => String(value)}
        />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip
          labelFormatter={(label) => `Año ${label}`}
          formatter={(value) => [
            Number(value).toLocaleString(),
            "Obras iniciadas",
          ]}
        />
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
