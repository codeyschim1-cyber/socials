'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CHART_COLORS } from '@/lib/constants';

interface LineChartProps {
  data: Record<string, unknown>[];
  lines: { dataKey: string; stroke: string; name: string }[];
  xAxisKey: string;
  height?: number;
}

export function LineChartWrapper({ data, lines, xAxisKey, height = 300 }: LineChartProps) {
  if (data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
        <XAxis dataKey={xAxisKey} stroke={CHART_COLORS.text} tick={{ fontSize: 12 }} />
        <YAxis stroke={CHART_COLORS.text} tick={{ fontSize: 12 }} />
        <Tooltip contentStyle={{ backgroundColor: CHART_COLORS.tooltip.bg, border: `1px solid ${CHART_COLORS.tooltip.border}`, borderRadius: '8px', fontSize: '12px' }} />
        <Legend />
        {lines.map(line => (
          <Line key={line.dataKey} type="monotone" dataKey={line.dataKey} stroke={line.stroke} name={line.name} dot={false} strokeWidth={2} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
