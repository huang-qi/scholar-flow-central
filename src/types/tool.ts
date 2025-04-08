
export interface Tool {
  id: string | number;
  name: string;
  description: string;
  type: string;
  tags: string[];
  author: string;
  lastUpdated: string;
  stars: number;
  views: number;
  hasDocumentation: boolean;
}
