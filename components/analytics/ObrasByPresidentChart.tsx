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

interface ObrasByPresidentData {
  name: string;
  color: string;
  Finalizadas: number;
  "En ejecucion": number;
  Paralizadas: number;
  Otras: number;
  total: number;
}

interface Props {
  data: ObrasByPresidentData[];
}

export default function ObrasByPresidentChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip
          formatter={(value, name) => [
            Number(value).toLocaleString(),
            name,
          ]}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="Finalizadas" fill="#22c55e" radius={[2, 2, 0, 0]} />
        <Bar dataKey="En ejecucion" fill="#eab308" radius={[2, 2, 0, 0]} />
        <Bar dataKey="Paralizadas" fill="#ef4444" radius={[2, 2, 0, 0]} />
        <Bar dataKey="Otras" fill="#6b7280" radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
