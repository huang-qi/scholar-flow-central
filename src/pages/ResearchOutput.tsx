
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Search, BarChart2, FileText, Upload, Filter
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BarChart } from "@/components/charts/BarChart";
import OutputCard from "@/components/research/OutputCard";

const ResearchOutput = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [outputs, setOutputs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchOutputs = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('research_outputs')
        .select('*');
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setOutputs(data);
      } else {
        // Sample data if no database records
        const sampleOutputs = [
          {
            id: "1",
            title: "Exploring Semi-supervised Learning for Medical Image Classification",
            type: "paper",
            authors: ["David Bennett", "Marie Chen", "James Wilson"],
            year: 2024,
            venue: "IEEE Transactions on Medical Imaging",
            tags: ["Medical Imaging", "Semi-supervised", "CNN"],
            citations: 12
          },
          {
            id: "2",
            title: "EfficientCV: A Lightweight Framework for Mobile Vision Models",
            type: "code",
            authors: ["Alex Jordan", "Robin Taylor"],
            year: 2024,
            link: "https://github.com/example/efficientcv",
            tags: ["Computer Vision", "Mobile", "Efficiency"],
            citations: 8
          },
          {
            id: "3",
            title: "Method and System for Real-time Sentiment Analysis",
            type: "patent",
            authors: ["David Bennett", "Marie Chen"],
            year: 2023,
            venue: "US Patent Office, #US123456789",
            tags: ["NLP", "Sentiment Analysis", "Real-time"],
            citations: 3
          }
        ];
        
        // Insert sample data if needed
        if (data.length === 0) {
          for (const sample of sampleOutputs) {
            await supabase.from('research_outputs').insert(sample);
          }
          setOutputs(sampleOutputs);
        }
      }
    } catch (error) {
      console.error('Error fetching research outputs:', error);
      toast({
        title: "Error",
        description: "Failed to load research outputs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOutputs();
  }, []);

  const handleOutputDeleted = async (id: string) => {
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('research_outputs')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setOutputs(prev => prev.filter(output => output.id !== id));
      
      toast({
        title: "Success",
        description: "Research output deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting research output:', error);
      toast({
        title: "Error",
        description: "Failed to delete research output",
        variant: "destructive",
      });
    }
  };

  // Get years for filtering
  const years = outputs.length > 0 
    ? Array.from(new Set(outputs.map(output => output.year))).sort((a, b) => b - a)
    : [];

  // Data for visualization
  const outputsByYear = years.map(year => {
    const papers = outputs.filter(o => o.year === year && o.type === "paper").length;
    const codes = outputs.filter(o => o.year === year && o.type === "code").length;
    const patents = outputs.filter(o => o.year === year && o.type === "patent").length;
    return { year, papers, codes, patents };
  });

  const chartData = {
    categories: years.map(year => year.toString()),
    series: [
      {
        name: "Papers",
        data: outputsByYear.map(item => item.papers),
      },
      {
        name: "Code",
        data: outputsByYear.map(item => item.codes),
      },
      {
        name: "Patents",
        data: outputsByYear.map(item => item.patents),
      },
    ],
  };

  const filteredOutputs = outputs.filter(output => {
    // Filter by search query
    const matchesSearch = !searchQuery || 
      output.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      output.authors.some((a: string) => a.toLowerCase().includes(searchQuery.toLowerCase())) ||
      output.tags.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Filter by type
    const matchesType = !selectedType || output.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Research Output</h1>
        <Button onClick={() => navigate("/add-output")}>
          <Upload className="h-4 w-4 mr-2" />
          Add Output
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Output Distribution</CardTitle>
          <CardDescription>
            Research outputs by year and type
          </CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          {years.length > 0 ? (
            <BarChart
              categories={chartData.categories}
              series={chartData.series}
              height={300}
              type="bar"
            />
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No data available for chart visualization
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search outputs..." 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select onValueChange={(value) => setSelectedType(value === "all" ? null : value)}>
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="paper">Papers</SelectItem>
                <SelectItem value="code">Code</SelectItem>
                <SelectItem value="patent">Patents</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Outputs</TabsTrigger>
            <TabsTrigger value="papers">Papers</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="patents">Patents</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader className="space-y-2">
                      <div className="h-4 w-2/3 bg-gray-200 rounded" />
                      <div className="h-3 w-1/2 bg-gray-200 rounded" />
                    </CardHeader>
                    <CardContent className="h-12" />
                  </Card>
                ))
              ) : filteredOutputs.length > 0 ? (
                filteredOutputs.map(output => (
                  <OutputCard 
                    key={output.id} 
                    output={output}
                    onDelete={() => handleOutputDeleted(output.id)} 
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <BarChart2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No outputs found</h3>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="papers">
            <div className="grid grid-cols-1 gap-4">
              {!isLoading && filteredOutputs
                .filter(output => output.type === "paper")
                .map(output => (
                  <OutputCard 
                    key={output.id} 
                    output={output}
                    onDelete={() => handleOutputDeleted(output.id)} 
                  />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="code">
            <div className="grid grid-cols-1 gap-4">
              {!isLoading && filteredOutputs
                .filter(output => output.type === "code")
                .map(output => (
                  <OutputCard 
                    key={output.id} 
                    output={output}
                    onDelete={() => handleOutputDeleted(output.id)} 
                  />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="patents">
            <div className="grid grid-cols-1 gap-4">
              {!isLoading && filteredOutputs
                .filter(output => output.type === "patent")
                .map(output => (
                  <OutputCard 
                    key={output.id} 
                    output={output}
                    onDelete={() => handleOutputDeleted(output.id)} 
                  />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ResearchOutput;
