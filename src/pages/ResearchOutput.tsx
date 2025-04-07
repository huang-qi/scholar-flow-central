import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import OutputTypeIcon from '@/components/OutputTypeIcon';

// Example data for research outputs
const researchOutputs = [
  {
    id: 1,
    title: "Deep Learning for Medical Image Segmentation",
    authors: ["John Smith", "Jane Doe"],
    type: "paper",
    year: 2023,
    journal: "IEEE Transactions on Medical Imaging",
    abstract: "This paper presents a novel approach for medical image segmentation using deep learning...",
    keywords: ["deep learning", "medical imaging", "segmentation"],
    citations: 42
  },
  {
    id: 2,
    title: "A Novel Algorithm for Anomaly Detection in Time Series Data",
    authors: ["Alice Johnson", "Bob Williams"],
    type: "code",
    year: 2022,
    journal: "Journal of Machine Learning Research",
    abstract: "We introduce a new algorithm for detecting anomalies in time series data with high accuracy and low computational cost...",
    keywords: ["anomaly detection", "time series", "machine learning"],
    citations: 28
  },
  {
    id: 3,
    title: "System and Method for Automated Patent Claim Generation",
    authors: ["Emily Brown", "David Garcia"],
    type: "patent",
    year: 2021,
    abstract: "This patent describes a system and method for automatically generating patent claims based on a given invention disclosure...",
    keywords: ["patent claim generation", "automation", "intellectual property"],
    citations: 15
  },
  {
    id: 4,
    title: "Graph Neural Networks for Drug Discovery",
    authors: ["Sarah Lee", "Michael Chen"],
    type: "paper",
    year: 2023,
    journal: "Bioinformatics",
    abstract: "We explore the use of graph neural networks for predicting drug-target interactions and identifying potential drug candidates...",
    keywords: ["graph neural networks", "drug discovery", "bioinformatics"],
    citations: 35
  },
  {
    id: 5,
    title: "Open Source Library for Data Visualization",
    authors: ["Kevin Rodriguez", "Linda Nguyen"],
    type: "code",
    year: 2022,
    abstract: "An open-source library providing a wide range of data visualization tools and techniques for various data types and formats...",
    keywords: ["data visualization", "open source", "visualization tools"],
    citations: 20
  },
  {
    id: 6,
    title: "Method for Securing Wireless Communication Networks",
    authors: ["Brian Wilson", "Jessica Martinez"],
    type: "patent",
    year: 2020,
    abstract: "A method for enhancing the security of wireless communication networks against various types of cyber attacks and intrusions...",
    keywords: ["wireless communication", "network security", "cybersecurity"],
    citations: 10
  }
];

// Publications by year data for chart
const publicationsByYear = [
  { year: '2020', papers: 5, patents: 1, codes: 3 },
  { year: '2021', papers: 8, patents: 2, codes: 6 },
  { year: '2022', papers: 12, patents: 3, codes: 8 },
  { year: '2023', papers: 15, patents: 4, codes: 10 }
];

const ResearchOutput = () => {
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
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Publications by Year</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            {/* Chart placeholder */}
            <div className="h-full flex items-center justify-center border border-dashed rounded-lg bg-muted">
              Publications Chart Goes Here
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex items-center justify-between mb-6">
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
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
          
          <div className="mt-6 space-y-4">
            {filteredOutputs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No research outputs found matching your criteria.
              </div>
            ) : (
              filteredOutputs.map((output) => (
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
              ))
            )}
          </div>
        </Tabs>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Upload New Research Output</CardTitle>
        </CardHeader>
        <CardContent>
          <Button>Upload New Output</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResearchOutput;
