
import React from 'react';
import { FileCode, FileText, FileCheck } from 'lucide-react';

type OutputType = 'code' | 'paper' | 'patent';

interface OutputTypeIconProps {
  type: OutputType;
  className?: string; // Make className optional
}

const OutputTypeIcon: React.FC<OutputTypeIconProps> = ({ type, className = '' }) => {
  switch (type) {
    case 'code':
      return <FileCode className={className} />;
    case 'paper':
      return <FileText className={className} />;
    case 'patent':
      return <FileCheck className={className} />;
    default:
      return null;
  }
};

export default OutputTypeIcon;
