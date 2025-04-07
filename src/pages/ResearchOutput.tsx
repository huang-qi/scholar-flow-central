
import React, { useState } from 'react';
import { researchOutputs, publicationsByYear } from '@/data/researchData';
import ResearchSummaryCards from '@/components/research/ResearchSummaryCards';
import PublicationChart from '@/components/research/PublicationChart';
import ResearchFilters from '@/components/research/ResearchFilters';
import ResearchOutputList from '@/components/research/ResearchOutputList';
import UploadSection from '@/components/research/UploadSection';
import { Tabs, TabsContent } from "@/components/ui/tabs";

const ResearchOutput: React.FC = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [yearFilter, setYearFilter] = useState<string>("");

  // Filter outputs based on search term, year, and active tab
  const filteredOutputs = researchOutputs.filter(output => {
    const matchesSearch = output.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         output.abstract.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         output.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         output.authors.some(author => author.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesYear = yearFilter ? output.year.toString() === yearFilter : true;
    
    const matchesType = activeTab === "all" ? true : output.type === activeTab;
    
    return matchesSearch && matchesYear && matchesType;
  });
  
  // Get unique years for filter
  const years = Array.from(new Set(researchOutputs.map(output => output.year.toString())));

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Research Output Repository</h1>
      
      <ResearchSummaryCards researchOutputs={researchOutputs} />
      
      <PublicationChart publicationsByYear={publicationsByYear} />
      
      <ResearchFilters
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        yearFilter={yearFilter}
        setYearFilter={setYearFilter}
        years={years}
      />
      
      <Tabs value={activeTab} className="w-full">
        <TabsContent value={activeTab} className="mt-6">
          <ResearchOutputList outputs={filteredOutputs} />
        </TabsContent>
      </Tabs>
      
      <div className="mt-6">
        <UploadSection />
      </div>
    </div>
  );
};

export default ResearchOutput;
