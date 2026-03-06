"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ProvinceData {
  name: string;
  count: number;
}

interface Props {
  data: ProvinceData[];
}

export default function ProvinceRankingChart({ data }: Props) {
  const chartHeight = Math.max(data.length * 32 + 40, 300);

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ left: 0, right: 10, top: 5, bottom: 5 }}
      >
        <XAxis type="number" tick={{ fontSize: 11 }} />
        <YAxis
          dataKey="name"
          type="category"
          width={130}
          tick={{ fontSize: 11 }}
        />
        <Tooltip
          formatter={(value) => [Number(value).toLocaleString(), "Obras"]}
        />
        <Bar dataKey="count" fill="#2897D4" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
