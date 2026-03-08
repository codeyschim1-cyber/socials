'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CHART_COLORS } from '@/lib/constants';

const COLORS = ['#8b5cf6', '#ec4899', '#2dd4bf', '#f59e0b', '#22c55e', '#06b6d4'];

interface PieChartProps {
  data: { name: string; value: number }[];
  height?: number;
}

export function PieChartWrapper({ data, height = 300 }: PieChartProps) {
  if (data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ backgroundColor: CHART_COLORS.tooltip.bg, border: `1px solid ${CHART_COLORS.tooltip.border}`, borderRadius: '8px', fontSize: '12px' }} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
