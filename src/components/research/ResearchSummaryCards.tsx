
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OutputType } from '@/components/OutputTypeIcon';

interface ResearchSummaryCardsProps {
  researchOutputs: Array<{
    type: OutputType;
  }>;
}

const ResearchSummaryCards: React.FC<ResearchSummaryCardsProps> = ({ researchOutputs }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card>
        <CardHeader>
          <CardTitle>Papers</CardTitle>
          <CardDescription>Academic publications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {researchOutputs.filter(o => o.type === "paper").length}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Patents</CardTitle>
          <CardDescription>Registered intellectual property</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {researchOutputs.filter(o => o.type === "patent").length}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Code Repositories</CardTitle>
          <CardDescription>Open-source software</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {researchOutputs.filter(o => o.type === "code").length}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResearchSummaryCards;
