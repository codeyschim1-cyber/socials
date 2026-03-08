'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CHART_COLORS } from '@/lib/constants';

interface BarChartProps {
  data: Record<string, unknown>[];
  bars: { dataKey: string; fill: string; name: string }[];
  xAxisKey: string;
  height?: number;
}

export function BarChartWrapper({ data, bars, xAxisKey, height = 300 }: BarChartProps) {
  if (data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
        <XAxis dataKey={xAxisKey} stroke={CHART_COLORS.text} tick={{ fontSize: 12 }} />
        <YAxis stroke={CHART_COLORS.text} tick={{ fontSize: 12 }} />
        <Tooltip contentStyle={{ backgroundColor: CHART_COLORS.tooltip.bg, border: `1px solid ${CHART_COLORS.tooltip.border}`, borderRadius: '8px', fontSize: '12px' }} />
        <Legend />
        {bars.map(bar => (
          <Bar key={bar.dataKey} dataKey={bar.dataKey} fill={bar.fill} name={bar.name} radius={[4, 4, 0, 0]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
