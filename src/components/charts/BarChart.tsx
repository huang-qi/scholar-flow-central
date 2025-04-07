
import React from 'react';
import { 
  Bar, 
  BarChart as RechartsBarChart, 
  CartesianGrid, 
  Legend, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from 'recharts';
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface BarChartProps {
  categories: string[];
  series: {
    name: string;
    data: number[];
  }[];
  height?: number;
  type?: string;
}

export const BarChart = ({ categories, series, height = 350, type = "bar" }: BarChartProps) => {
  // Transform the data into the format Recharts expects
  const data = categories.map((category, index) => {
    const item: Record<string, any> = { name: category };
    series.forEach((serie) => {
      item[serie.name] = serie.data[index];
    });
    return item;
  });

  const colors = ["#0369a1", "#6366f1", "#f59e0b"];

  return (
    <ChartContainer config={{}} className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          {series.map((serie, index) => (
            <Bar 
              key={serie.name} 
              dataKey={serie.name} 
              fill={colors[index % colors.length]} 
              radius={[4, 4, 0, 0]} 
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
