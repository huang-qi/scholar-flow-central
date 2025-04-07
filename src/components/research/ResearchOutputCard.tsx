
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import OutputTypeIcon, { OutputType } from '@/components/OutputTypeIcon';

export interface ResearchOutputItem {
  id: number;
  title: string;
  authors: string[];
  type: OutputType;
  year: number;
  journal?: string;
  abstract: string;
  keywords: string[];
  citations: number;
}

interface ResearchOutputCardProps {
  output: ResearchOutputItem;
}

const ResearchOutputCard: React.FC<ResearchOutputCardProps> = ({ output }) => {
  return (
    <Card key={output.id}>
      <CardHeader className="pb-2">
        <div className="flex items-start gap-2">
          <OutputTypeIcon type={output.type} className="mt-1 h-5 w-5 flex-shrink-0" />
          <div>
            <CardTitle className="text-xl">{output.title}</CardTitle>
            <div className="text-sm text-muted-foreground mt-1">
              {output.authors.join(", ")} • {output.year}
              {output.type === "paper" && output.journal ? ` • ${output.journal}` : ""}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{output.abstract}</p>
        <div className="flex flex-wrap gap-2">
          {output.keywords.map((keyword, idx) => (
            <Badge key={idx} variant="outline">{keyword}</Badge>
          ))}
          {output.citations !== undefined && (
            <Badge variant="secondary">Cited {output.citations} times</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResearchOutputCard;
