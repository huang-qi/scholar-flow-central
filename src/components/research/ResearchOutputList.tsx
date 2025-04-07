
import React from 'react';
import ResearchOutputCard, { ResearchOutputItem } from './ResearchOutputCard';

interface ResearchOutputListProps {
  outputs: ResearchOutputItem[];
}

const ResearchOutputList: React.FC<ResearchOutputListProps> = ({ outputs }) => {
  if (outputs.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No research outputs found matching your criteria.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {outputs.map((output) => (
        <ResearchOutputCard key={output.id} output={output} />
      ))}
    </div>
  );
};

export default ResearchOutputList;
