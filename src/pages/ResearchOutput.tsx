
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart } from "@/components/ui/chart";
import { 
  Search, BarChart2, FileText, Code, Award,
  ExternalLink, Download, Eye, Upload, Filter
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ResearchOutput {
  id: number;
  title: string;
  type: "paper" | "code" | "patent";
  authors: string[];
  year: number;
  venue?: string;
  link?: string;
  tags: string[];
  citations?: number;
}

const sampleOutputs: ResearchOutput[] = [
  {
    id: 1,
    title: "Exploring Semi-supervised Learning for Medical Image Classification",
    type: "paper",
    authors: ["David Bennett", "Marie Chen", "James Wilson"],
    year: 2024,
    venue: "IEEE Transactions on Medical Imaging",
    tags: ["Medical Imaging", "Semi-supervised", "CNN"],
    citations: 12
  },
  {
    id: 2,
    title: "EfficientCV: A Lightweight Framework for Mobile Vision Models",
    type: "code",
    authors: ["Alex Jordan", "Robin Taylor"],
    year: 2024,
    link: "https://github.com/example/efficientcv",
    tags: ["Computer Vision", "Mobile", "Efficiency"],
    citations: 8
  },
  {
    id: 3,
    title: "Method and System for Real-time Sentiment Analysis",
    type: "patent",
    authors: ["David Bennett", "Marie Chen"],
    year: 2023,
    venue: "US Patent Office, #US123456789",
    tags: ["NLP", "Sentiment Analysis", "Real-time"],
    citations: 3
  },
  {
    id: 4,
    title: "Transformer-based Architecture for Cross-lingual Transfer Learning",
    type: "paper",
    authors: ["Marie Chen", "David Bennett", "Robin Taylor"],
    year: 2023,
    venue: "ACL Conference",
    tags: ["NLP", "Transfer Learning", "Cross-lingual"],
    citations: 35
  },
  {
    id: 5,
    title: "LitReview: An Open Source Tool for Literature Review Management",
    type: "code",
    authors: ["Robin Taylor", "Alex Jordan"],
    year: 2023,
    link: "https://github.com/example/litreview",
    tags: ["Literature Review", "Research Tool"],
    citations: 15
  },
  {
    id: 6,
    title: "End-to-End System for Multimodal Learning",
    type: "patent",
    authors: ["David Bennett", "Marie Chen", "Alex Jordan"],
    year: 2022,
    venue: "European Patent Office, #EP987654321",
    tags: ["Multimodal", "End-to-End Learning"],
    citations: 7
  },
  {
    id: 7,
    title: "COSMOS: A Framework for Continual Self-supervised Learning",
    type: "paper",
    authors: ["Alex Jordan", "David Bennett"],
    year: 2022,
    venue: "NeurIPS",
    tags: ["Self-supervised", "Continual Learning"],
    citations: 54
  }
];

const OutputTypeIcon = ({ type }: { type: "paper" | "code" | "patent" }) => {
  switch (type) {
    case "paper":
      return <FileText className="h-5 w-5" />;
    case "code":
      return <Code className="h-5 w-5" />;
    case "patent":
      return <Award className="h-5 w-5" />;
  }
};

const OutputCard = ({ output }: { output: ResearchOutput }) => {
  return (
    <Card className="card-hover">
      <CardHeader className="pb-2">
        <div className="flex items-start gap-3">
          <div className={`flex h-9 w-9 items-center justify-center rounded-full ${
            output.type === "paper" ? "bg-primary/10" : 
            output.type === "code" ? "bg-accent/10" : 
            "bg-amber-500/10"
          }`}>
            <OutputTypeIcon type={output.type} className={`${
              output.type === "paper" ? "text-primary" : 
              output.type === "code" ? "text-accent" : 
              "text-amber-500"
            }`} />
          </div>
          <div>
            <CardTitle className="text-lg">{output.title}</CardTitle>
            <CardDescription>
              {output.authors.slice(0, 3).join(", ")}
              {output.authors.length > 3 ? ", et al." : ""} • {output.year}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex flex-wrap gap-2 mb-2">
          {output.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        {output.venue && (
          <div className="text-sm text-muted-foreground">
            {output.venue}
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-between pt-2">
        {output.citations !== undefined && (
          <div className="text-sm text-muted-foreground">
            Citations: {output.citations}
          </div>
        )}
        <div className="flex gap-2">
          {output.type === "code" && output.link && (
            <Button size="sm" variant="outline">
              <ExternalLink className="h-4 w-4 mr-1" />
              Repository
            </Button>
          )}
          {output.type === "paper" && (
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4 mr-1" />
              PDF
            </Button>
          )}
          <Button size="sm">
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

const ResearchOutput = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // Get years for filtering
  const years = Array.from(new Set(sampleOutputs.map(output => output.year)))
    .sort((a, b) => b - a);

  // Data for visualization
  const outputsByYear = years.map(year => {
    const papers = sampleOutputs.filter(o => o.year === year && o.type === "paper").length;
    const codes = sampleOutputs.filter(o => o.year === year && o.type === "code").length;
    const patents = sampleOutputs.filter(o => o.year === year && o.type === "patent").length;
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

  const filteredOutputs = sampleOutputs.filter(output => {
    // Filter by search query
    const matchesSearch = !searchQuery || 
      output.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      output.authors.some(a => a.toLowerCase().includes(searchQuery.toLowerCase())) ||
      output.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Filter by type
    const matchesType = !selectedType || output.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Research Output</h1>
        <Button>
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
          <BarChart
            categories={chartData.categories}
            series={chartData.series}
            height={300}
            type="bar"
          />
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
              {filteredOutputs.length > 0 ? (
                filteredOutputs.map(output => (
                  <OutputCard key={output.id} output={output} />
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
              {filteredOutputs
                .filter(output => output.type === "paper")
                .map(output => (
                  <OutputCard key={output.id} output={output} />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="code">
            <div className="grid grid-cols-1 gap-4">
              {filteredOutputs
                .filter(output => output.type === "code")
                .map(output => (
                  <OutputCard key={output.id} output={output} />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="patents">
            <div className="grid grid-cols-1 gap-4">
              {filteredOutputs
                .filter(output => output.type === "patent")
                .map(output => (
                  <OutputCard key={output.id} output={output} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ResearchOutput;
