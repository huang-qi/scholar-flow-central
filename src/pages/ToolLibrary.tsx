
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Star, Download, Wrench, Star as StarIcon } from 'lucide-react';

// Example AI tools data
const aiTools = [
  {
    id: 1,
    name: "Image Segmentation Tool",
    description: "Automated segmentation of medical images using deep learning.",
    category: "medical",
    rating: 4.8,
    downloads: 245,
    tags: ["medical imaging", "segmentation", "deep learning"]
  },
  {
    id: 2,
    name: "Data Augmentation Pipeline",
    description: "Generate synthetic data to improve model training with diverse samples.",
    category: "data",
    rating: 4.5,
    downloads: 320,
    tags: ["data augmentation", "synthetic data", "training"]
  },
  {
    id: 3,
    name: "Model Explainability Dashboard",
    description: "Visualize and understand your model's decision making process.",
    category: "visualization",
    rating: 4.6,
    downloads: 187,
    tags: ["interpretability", "visualization", "XAI"]
  },
  {
    id: 4,
    name: "Hyperparameter Optimization",
    description: "Automated tuning of model hyperparameters using Bayesian optimization.",
    category: "training",
    rating: 4.7,
    downloads: 278,
    tags: ["hyperparameters", "optimization", "training"]
  },
  {
    id: 5,
    name: "Natural Language Processing Pipeline",
    description: "End-to-end pipeline for text processing, analysis and modeling.",
    category: "nlp",
    rating: 4.4,
    downloads: 310,
    tags: ["NLP", "text analysis", "language models"]
  }
];

const ToolLibrary = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  // Get unique categories for tabs
  const categories = ["all", ...Array.from(new Set(aiTools.map(tool => tool.category)))];
  
  // Filter tools based on search term and active category
  const filteredTools = aiTools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = activeTab === "all" ? true : tool.category === activeTab;
    
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">AI Tool Library</h1>
          <p className="text-muted-foreground">Access and manage AI tools developed by the research group</p>
        </div>
        <Button>Upload New Tool</Button>
      </div>
      
      <div className="mb-6">
        <Input 
          placeholder="Search tools by name, description or tags..." 
          className="max-w-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          {categories.map(category => (
            <TabsTrigger key={category} value={category} className="capitalize">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value={activeTab}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.length === 0 ? (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                No tools found matching your criteria.
              </div>
            ) : (
              filteredTools.map(tool => (
                <Card key={tool.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{tool.name}</CardTitle>
                        <CardDescription className="mt-1 capitalize">
                          {tool.category}
                        </CardDescription>
                      </div>
                      <div className="bg-primary/10 rounded-full p-2">
                        <Wrench className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{tool.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {tool.tags.map((tag, idx) => (
                        <Badge key={idx} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <StarIcon className="h-4 w-4 text-amber-500 fill-amber-500" />
                        <span>{tool.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{tool.downloads}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" className="flex-1">Details</Button>
                      <Button size="sm" className="flex-1">Download</Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ToolLibrary;
