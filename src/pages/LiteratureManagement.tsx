
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Book, Search, Filter, Upload, Clock
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
import PublicationCard from "@/components/literature/PublicationCard";

const LiteratureManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [publications, setPublications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchPublications = async () => {
    try {
      setIsLoading(true);
      
      // Check local storage first
      const storedPublications = localStorage.getItem('literature');
      if (storedPublications) {
        setPublications(JSON.parse(storedPublications));
        setIsLoading(false);
        return;
      }
      
      // If no local storage data, use sample data
      const samplePublications = [
        {
          id: "1",
          title: "Attention Is All You Need",
          authors: ["Ashish Vaswani", "Noam Shazeer", "Niki Parmar"],
          journal: "NeurIPS",
          year: 2017,
          doi: "10.48550/arXiv.1706.03762",
          tags: ["NLP", "Transformer", "Attention"],
          rating: 5,
          notes: true
        },
        {
          id: "2",
          title: "Deep Residual Learning for Image Recognition",
          authors: ["Kaiming He", "Xiangyu Zhang", "Shaoqing Ren", "Jian Sun"],
          journal: "CVPR",
          year: 2016,
          doi: "10.1109/CVPR.2016.90",
          tags: ["Computer Vision", "CNN", "ResNet"],
          rating: 5,
          notes: true
        },
        {
          id: "3",
          title: "Language Models are Few-Shot Learners",
          authors: ["Tom B. Brown", "Benjamin Mann", "Nick Ryder"],
          journal: "NeurIPS",
          year: 2020,
          doi: "10.48550/arXiv.2005.14165",
          tags: ["NLP", "GPT", "Few-shot Learning"],
          rating: 4,
          notes: false
        }
      ];
      setPublications(samplePublications);
      
      // Save to localStorage for future use
      localStorage.setItem('literature', JSON.stringify(samplePublications));
    } catch (error) {
      console.error('Error fetching literature:', error);
      toast({
        title: "Error",
        description: "Failed to load literature. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPublications();
  }, []);

  const handlePublicationDeleted = (id: string) => {
    const updatedPublications = publications.filter(pub => pub.id !== id);
    setPublications(updatedPublications);
    localStorage.setItem('literature', JSON.stringify(updatedPublications));
  };
  
  const handleToggleSaved = (id: string) => {
    const updatedPublications = publications.map(pub => 
      pub.id === id ? { ...pub, saved: !pub.saved } : pub
    );
    setPublications(updatedPublications);
    localStorage.setItem('literature', JSON.stringify(updatedPublications));
  };

  // Get unique tags from all publications
  const allTags = Array.from(
    new Set(publications.flatMap(pub => pub.tags))
  ).sort();

  const filteredPublications = publications.filter(pub => {
    // Filter by search query
    const matchesSearch = !searchQuery || 
      pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pub.authors.some((a: string) => a.toLowerCase().includes(searchQuery.toLowerCase())) ||
      pub.tags.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Filter by tag
    const matchesTag = !selectedTag || pub.tags.includes(selectedTag);
    
    return matchesSearch && matchesTag;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Literature</h1>
        <Button onClick={() => navigate("/add-literature")}>
          <Upload className="h-4 w-4 mr-2" />
          Add Literature
        </Button>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search literature..." 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select onValueChange={(value) => setSelectedTag(value === "all" ? null : value)}>
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by tag" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                {allTags.map(tag => (
                  <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[140px]">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Year" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {Array.from(new Set(publications.map(p => p.year)))
                  .sort((a, b) => b - a)
                  .map(year => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Literature</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="notes">With Notes</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isLoading ? (
                [...Array(4)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader className="space-y-2">
                      <div className="h-4 w-2/3 bg-gray-200 rounded" />
                      <div className="h-3 w-1/2 bg-gray-200 rounded" />
                    </CardHeader>
                    <CardContent className="h-12" />
                  </Card>
                ))
              ) : filteredPublications.length > 0 ? (
                filteredPublications.map(pub => (
                  <PublicationCard 
                    key={pub.id} 
                    publication={pub}
                    onDelete={handlePublicationDeleted}
                    onToggleSaved={handleToggleSaved}
                  />
                ))
              ) : (
                <div className="text-center py-12 col-span-2">
                  <Book className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No literature found</h3>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="recent">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {!isLoading && publications.slice(0, 4).map(pub => (
                <PublicationCard 
                  key={pub.id} 
                  publication={pub}
                  onDelete={handlePublicationDeleted}
                  onToggleSaved={handleToggleSaved}
                />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="notes">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {!isLoading && publications.filter(pub => pub.notes).map(pub => (
                <PublicationCard 
                  key={pub.id} 
                  publication={pub}
                  onDelete={handlePublicationDeleted}
                  onToggleSaved={handleToggleSaved}
                />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="favorites">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {!isLoading && publications.filter(pub => pub.rating === 5).map(pub => (
                <PublicationCard 
                  key={pub.id} 
                  publication={pub}
                  onDelete={handlePublicationDeleted}
                  onToggleSaved={handleToggleSaved}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LiteratureManagement;
