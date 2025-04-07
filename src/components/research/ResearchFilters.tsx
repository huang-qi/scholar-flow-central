
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ResearchFiltersProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  yearFilter: string;
  setYearFilter: (year: string) => void;
  years: string[];
}

const ResearchFilters: React.FC<ResearchFiltersProps> = ({
  activeTab,
  setActiveTab,
  searchTerm,
  setSearchTerm,
  yearFilter,
  setYearFilter,
  years
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <Tabs defaultValue={activeTab} className="w-full" onValueChange={setActiveTab}>
        <div className="flex justify-between items-center flex-wrap gap-4">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="paper">Papers</TabsTrigger>
            <TabsTrigger value="patent">Patents</TabsTrigger>
            <TabsTrigger value="code">Codes</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <Input
              placeholder="Search outputs..."
              className="w-[200px] md:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Years</SelectItem>
                {years.map(year => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default ResearchFilters;
