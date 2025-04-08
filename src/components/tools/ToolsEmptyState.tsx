
import { Wrench } from "lucide-react";

interface ToolsEmptyStateProps {
  selectedType: string | null;
  searchQuery: string;
}

const ToolsEmptyState = ({ selectedType, searchQuery }: ToolsEmptyStateProps) => (
  <div className="text-center py-12">
    <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
    <h3 className="text-lg font-medium">No tools found</h3>
    <p className="text-sm text-muted-foreground">
      Try adjusting your search or filter criteria
    </p>
  </div>
);

export default ToolsEmptyState;
