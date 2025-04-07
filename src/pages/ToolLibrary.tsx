
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Search, Tool, Star, Upload, ExternalLink, 
  Download, Play, Eye, HeartIcon
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AITool {
  id: number;
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

const sampleTools: AITool[] = [
  {
    id: 1,
    name: "Image Segmentation API",
    description: "A pre-trained API for quick and accurate image segmentation tasks",
    type: "API",
    tags: ["Computer Vision", "Segmentation", "Deep Learning"],
    author: "Marie Chen",
    lastUpdated: "2025-03-15",
    stars: 28,
    views: 124,
    hasDocumentation: true
  },
  {
    id: 2,
    name: "NLP Preprocessing Toolkit",
    description: "A comprehensive toolkit for NLP data preprocessing",
    type: "Python Package",
    tags: ["NLP", "Preprocessing", "Text"],
    author: "Alex Jordan",
    lastUpdated: "2025-02-20",
    stars: 42,
    views: 256,
    hasDocumentation: true
  },
  {
    id: 3,
    name: "Automated Data Augmentation",
    description: "Tool to automatically generate and apply data augmentation strategies",
    type: "Python Script",
    tags: ["Data Augmentation", "ML", "Optimization"],
    author: "Robin Taylor",
    lastUpdated: "2025-03-28",
    stars: 15,
    views: 89,
    hasDocumentation: false
  },
  {
    id: 4,
    name: "Model Explainability Dashboard",
    description: "Interactive dashboard for visualizing and understanding ML model decisions",
    type: "Web App",
    tags: ["Explainability", "Visualization", "Dashboard"],
    author: "David Bennett",
    lastUpdated: "2025-04-02",
    stars: 36,
    views: 145,
    hasDocumentation: true
  },
  {
    id: 5,
    name: "Hyperparameter Optimization Service",
    description: "Automated hyperparameter tuning for machine learning models",
    type: "Service",
    tags: ["Optimization", "Hyperparameter", "AutoML"],
    author: "Marie Chen",
    lastUpdated: "2025-01-10",
    stars: 21,
    views: 102,
    hasDocumentation: true
  }
];

const ToolCard = ({ tool }: { tool: AITool }) => {
  return (
    <Card className="card-hover">
      <CardHeader>
        <div className="flex justify-between">
          <div>
            <CardTitle className="text-lg">{tool.name}</CardTitle>
            <CardDescription className="text-sm">{tool.type} by {tool.author}</CardDescription>
          </div>
          <Badge variant="outline">{tool.views} views</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed mb-4">{tool.description}</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {tool.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>Last updated: {new Date(tool.lastUpdated).toLocaleDateString()}</div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-amber-500" />
            <span>{tool.stars}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-between pt-0">
        <div className="flex items-center text-sm">
          {tool.hasDocumentation && (
            <div className="flex items-center gap-1 text-primary">
              <Eye className="h-4 w-4" />
              <span>Documentation</span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <HeartIcon className="h-4 w-4 mr-1" />
            Favorite
          </Button>
          <Button size="sm">
            <Play className="h-4 w-4 mr-1" />
            Try It
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

const ToolLibrary = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // Get unique tool types
  const toolTypes = Array.from(new Set(sampleTools.map(tool => tool.type))).sort();

  const filteredTools = sampleTools.filter(tool => {
    // Filter by search query
    const matchesSearch = !searchQuery || 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Filter by type
    const matchesType = !selectedType || tool.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">AI Tool Library</h1>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Add Tool
        </Button>
      </div>

      <div className="space-y-6">
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
                  <Tool className="h-4 w-4 mr-2" />
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

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Tools</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="recent">Recently Used</TabsTrigger>
            <TabsTrigger value="my">My Tools</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {filteredTools.length > 0 ? (
                filteredTools.map(tool => (
                  <ToolCard key={tool.id} tool={tool} />
                ))
              ) : (
                <div className="text-center py-12">
                  <Tool className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No tools found</h3>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="favorites">
            <div className="grid grid-cols-1 gap-4">
              {/* Just showing a couple of sample favorites */}
              {sampleTools.slice(1, 3).map(tool => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="recent">
            <div className="grid grid-cols-1 gap-4">
              {/* Just showing a couple of recently used tools */}
              {sampleTools.slice(0, 2).map(tool => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="my">
            <div className="grid grid-cols-1 gap-4">
              {/* Just showing tools by the current user */}
              {sampleTools.filter(tool => tool.author === "David Bennett").map(tool => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ToolLibrary;
