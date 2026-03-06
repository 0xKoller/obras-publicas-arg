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
import { formatARS } from "@/lib/constants";

interface BudgetByPresidentData {
  name: string;
  budget: number;
  color: string;
}

interface Props {
  data: BudgetByPresidentData[];
}

export default function BudgetByPresidentChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis
          tick={{ fontSize: 11 }}
          tickFormatter={(value: number) => formatARS(value)}
        />
        <Tooltip
          formatter={(value) => [formatARS(Number(value)), "Presupuesto"]}
        />
        <Bar dataKey="budget" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
