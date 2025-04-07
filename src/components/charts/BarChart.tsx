
import React from 'react';
import { 
  ChartContainer, 
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart";
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

interface BarChartProps {
  data: Record<string, any>[];
  categories: string[];
  xAxisKey: string;
  colors?: string[];
  height?: number;
  className?: string;
}

const BarChart: React.FC<BarChartProps> = ({ 
  data, 
  categories, 
  xAxisKey,
  colors = ["#3b82f6", "#10b981", "#6366f1"], 
  height = 300,
  className = ""
}) => {
  return (
    <div className={`w-full h-[${height}px] ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          {categories.map((category, index) => (
            <Bar key={category} dataKey={category} fill={colors[index % colors.length]} />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
