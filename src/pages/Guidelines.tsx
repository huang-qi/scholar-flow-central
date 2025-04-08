
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Upload, FileText, Download, Eye } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

interface GuidelineDocument {
  id: number;
  title: string;
  category: string;
  version: string;
  lastUpdated: string;
  description: string;
  fileName: string;
}

const sampleGuidelines: GuidelineDocument[] = [
  {
    id: 1,
    title: "Research Paper Submission Guidelines",
    category: "Manuscript Submission",
    version: "2.3",
    lastUpdated: "2025-02-15",
    description: "Standard procedures for submitting papers to conferences and journals",
    fileName: "paper_submission_guidelines.pdf"
  },
  {
    id: 2,
    title: "Code Repository Standards",
    category: "Code Management",
    version: "1.5",
    lastUpdated: "2025-03-10",
    description: "Guidelines for organizing and documenting code repositories",
    fileName: "code_repository_standards.pdf"
  },
  {
    id: 3,
    title: "Weekly Report Template",
    category: "Reporting",
    version: "3.1",
    lastUpdated: "2025-04-01",
    description: "Template and instructions for weekly research progress reports",
    fileName: "weekly_report_template.docx"
  },
  {
    id: 4,
    title: "Publication Naming Conventions",
    category: "Naming Conventions",
    version: "1.2",
    lastUpdated: "2025-01-20",
    description: "Standardized naming conventions for research publications",
    fileName: "publication_naming_conventions.pdf"
  },
  {
    id: 5,
    title: "Lab Equipment Usage Protocol",
    category: "Laboratory",
    version: "2.0",
    lastUpdated: "2025-03-05",
    description: "Procedures for safely operating and booking lab equipment",
    fileName: "lab_equipment_protocol.pdf"
  },
  {
    id: 6,
    title: "Research Data Storage Policy",
    category: "Data Management",
    version: "2.4",
    lastUpdated: "2025-02-28",
    description: "Requirements and best practices for research data storage and backup",
    fileName: "data_storage_policy.pdf"
  },
  {
    id: 7,
    title: "Collaboration Agreement Template",
    category: "Collaboration",
    version: "1.1",
    lastUpdated: "2025-01-15",
    description: "Template for establishing research collaboration agreements",
    fileName: "collaboration_agreement.docx"
  }
];

// Group guidelines by category
const guidelinesByCategory = sampleGuidelines.reduce((acc, guideline) => {
  if (!acc[guideline.category]) {
    acc[guideline.category] = [];
  }
  acc[guideline.category].push(guideline);
  return acc;
}, {} as Record<string, GuidelineDocument[]>);

const GuidelineItem = ({ guideline }: { guideline: GuidelineDocument }) => {
  return (
    <Card className="card-hover">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{guideline.title}</CardTitle>
          <Badge variant="outline">v{guideline.version}</Badge>
        </div>
        <CardDescription>
          Updated: {new Date(guideline.lastUpdated).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground mb-2">
          {guideline.description}
        </p>
        <div className="text-xs text-muted-foreground">
          File: {guideline.fileName}
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
          <Button size="sm">
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

const Guidelines = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter guidelines based on search query
  const filteredGuidelines = sampleGuidelines.filter(guideline =>
    guideline.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guideline.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guideline.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredCategories = Object.keys(guidelinesByCategory).filter(category =>
    category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guidelinesByCategory[category].some(guideline => 
      guideline.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guideline.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Guidelines & Policies</h1>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Add Guidelines
        </Button>
      </div>

      <div className="space-y-6">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search guidelines..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="space-y-4">
          {searchQuery ? (
            filteredGuidelines.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredGuidelines.map(guideline => (
                  <GuidelineItem key={guideline.id} guideline={guideline} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No guidelines found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search query
                </p>
              </div>
            )
          ) : (
            <Accordion type="multiple" className="w-full">
              {Object.keys(guidelinesByCategory).map(category => (
                <AccordionItem key={category} value={category}>
                  <AccordionTrigger className="hover:bg-secondary/50 px-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>{category}</span>
                      <Badge className="ml-2" variant="outline">
                        {guidelinesByCategory[category].length}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 px-2">
                      {guidelinesByCategory[category].map(guideline => (
                        <GuidelineItem key={guideline.id} guideline={guideline} />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </div>
    </div>
  );
};

export default Guidelines;
