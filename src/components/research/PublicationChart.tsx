
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BarChart from '@/components/charts/BarChart';

interface PublicationData {
  year: string;
  papers: number;
  patents: number;
  codes: number;
}

interface PublicationChartProps {
  publicationsByYear: PublicationData[];
}

const PublicationChart: React.FC<PublicationChartProps> = ({ publicationsByYear }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Publications by Year</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <BarChart 
            data={publicationsByYear} 
            categories={['papers', 'patents', 'codes']} 
            xAxisKey="year" 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PublicationChart;
