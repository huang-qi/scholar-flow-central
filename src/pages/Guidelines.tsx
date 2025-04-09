
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Upload, FileText } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import GuidelineItem from "@/components/guidelines/GuidelineItem";

const Guidelines = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [guidelines, setGuidelines] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchGuidelines = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('guidelines')
        .select('*');
      
      if (error && error.code !== '42P01') { // 42P01 is "table doesn't exist"
        throw error;
      }
      
      if (data && data.length > 0) {
        // Format the data to match our component's expected format
        const formattedGuidelines = data.map(item => ({
          id: item.id,
          title: item.title,
          category: item.category,
          version: item.version || "1.0",
          lastUpdated: item.updated_at,
          description: item.content,
          fileName: `${item.title.toLowerCase().replace(/\s+/g, '_')}.pdf`
        }));
        
        setGuidelines(formattedGuidelines);
      } else {
        // Use sample data if no data in database
        const sampleGuidelines = [
          {
            id: "1",
            title: "Research Paper Submission Guidelines",
            category: "Manuscript Submission",
            version: "2.3",
            lastUpdated: "2025-02-15",
            description: "Standard procedures for submitting papers to conferences and journals",
            fileName: "paper_submission_guidelines.pdf"
          },
          {
            id: "2",
            title: "Code Repository Standards",
            category: "Code Management",
            version: "1.5",
            lastUpdated: "2025-03-10",
            description: "Guidelines for organizing and documenting code repositories",
            fileName: "code_repository_standards.pdf"
          },
          {
            id: "3",
            title: "Weekly Report Template",
            category: "Reporting",
            version: "3.1",
            lastUpdated: "2025-04-01",
            description: "Template and instructions for weekly research progress reports",
            fileName: "weekly_report_template.docx"
          }
        ];
        setGuidelines(sampleGuidelines);
      }
    } catch (error) {
      console.error('Error fetching guidelines:', error);
      toast({
        title: "Error",
        description: "Failed to load guidelines. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGuidelines();
  }, []);

  const handleGuidelineDeleted = () => {
    fetchGuidelines();
  };

  // Filter guidelines based on search query
  const filteredGuidelines = guidelines.filter(guideline =>
    guideline.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guideline.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guideline.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const guidelinesByCategory = filteredGuidelines.reduce((acc, guideline) => {
    if (!acc[guideline.category]) {
      acc[guideline.category] = [];
    }
    acc[guideline.category].push(guideline);
    return acc;
  }, {} as Record<string, typeof filteredGuidelines>);
  
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
        <Button onClick={() => navigate("/add-guideline")}>
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
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="space-y-2">
                    <div className="h-4 w-2/3 bg-gray-200 rounded" />
                    <div className="h-3 w-1/2 bg-gray-200 rounded" />
                  </CardHeader>
                  <CardContent className="h-12" />
                </Card>
              ))}
            </div>
          ) : searchQuery ? (
            filteredGuidelines.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredGuidelines.map(guideline => (
                  <GuidelineItem 
                    key={guideline.id} 
                    guideline={guideline}
                    onDelete={handleGuidelineDeleted}
                  />
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
              {filteredCategories.map(category => (
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
                        <GuidelineItem 
                          key={guideline.id} 
                          guideline={guideline}
                          onDelete={handleGuidelineDeleted}
                        />
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
