
import { Search, Wrench } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ToolsFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedType: string | null;
  setSelectedType: (type: string | null) => void;
  toolTypes: string[];
}

const ToolsFilters = ({ 
  searchQuery, 
  setSearchQuery, 
  selectedType, 
  setSelectedType,
  toolTypes 
}: ToolsFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input 
          placeholder="Search tools..." 
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Select onValueChange={(value) => setSelectedType(value === "all" ? null : value)}>
          <SelectTrigger className="w-[180px]">
            <div className="flex items-center">
              <Wrench className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Tool type" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {toolTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ToolsFilters;
