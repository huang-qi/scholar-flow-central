
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Book, Search, Filter, Upload, Clock, 
  BookOpen, Star, StarHalf, Download, Link, ExternalLink
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Publication {
  id: number;
  title: string;
  authors: string[];
  journal?: string;
  year: number;
  doi?: string;
  tags: string[];
  rating?: number;
  notes: boolean;
}

const samplePublications: Publication[] = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
    title: "Language Models are Few-Shot Learners",
    authors: ["Tom B. Brown", "Benjamin Mann", "Nick Ryder"],
    journal: "NeurIPS",
    year: 2020,
    doi: "10.48550/arXiv.2005.14165",
    tags: ["NLP", "GPT", "Few-shot Learning"],
    rating: 4,
    notes: false
  },
  {
    id: 4,
    title: "A Generalized Framework for Population Based Training",
    authors: ["Martin Jaderberg", "Valentin Dalibard", "Jack W. Rae"],
    journal: "KDD",
    year: 2019,
    doi: "10.48550/arXiv.1902.01894",
    tags: ["Optimization", "Hyperparameter Tuning"],
    rating: 3,
    notes: false
  },
  {
    id: 5,
    title: "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding",
    authors: ["Jacob Devlin", "Ming-Wei Chang", "Kenton Lee", "Kristina Toutanova"],
    journal: "NAACL",
    year: 2019,
    doi: "10.48550/arXiv.1810.04805",
    tags: ["NLP", "BERT", "Transformer"],
    rating: 5,
    notes: true
  },
  {
    id: 6,
    title: "Reinforcement Learning with Human Feedback",
    authors: ["Noel Bard", "Jakob Foerster", "Thore Graepel"],
    journal: "Nature Machine Intelligence",
    year: 2022,
    tags: ["RL", "Human Feedback", "LLM"],
    rating: 4,
    notes: true
  }
];

const PublicationCard = ({ publication }: { publication: Publication }) => {
  return (
    <Card className="card-hover">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg leading-tight">{publication.title}</CardTitle>
        <CardDescription>
          {publication.authors.slice(0, 3).join(", ")}
          {publication.authors.length > 3 ? ", et al." : ""}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex flex-wrap gap-2 mb-3">
          {publication.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            {publication.journal && `${publication.journal}, `}
            <span>{publication.year}</span>
          </div>
          <div className="flex items-center">
            {publication.rating && Array(publication.rating).fill(0).map((_, i) => (
              <Star key={i} className="h-4 w-4 text-amber-500" />
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-between pt-2">
        <div className="flex items-center text-sm">
          {publication.notes && (
            <div className="flex items-center gap-1 text-teal-600">
              <BookOpen className="h-4 w-4" />
              <span>Notes</span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Download className="h-4 w-4 mr-1" />
            PDF
          </Button>
          {publication.doi && (
            <Button size="sm" variant="outline">
              <ExternalLink className="h-4 w-4 mr-1" />
              DOI
            </Button>
          )}
          <Button size="sm">
            <BookOpen className="h-4 w-4 mr-1" />
            Read
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

const LiteratureManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Get unique tags from all publications
  const allTags = Array.from(
    new Set(samplePublications.flatMap(pub => pub.tags))
  ).sort();

  const filteredPublications = samplePublications.filter(pub => {
    // Filter by search query
    const matchesSearch = !searchQuery || 
      pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pub.authors.some(a => a.toLowerCase().includes(searchQuery.toLowerCase())) ||
      pub.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Filter by tag
    const matchesTag = !selectedTag || pub.tags.includes(selectedTag);
    
    return matchesSearch && matchesTag;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Literature</h1>
        <Button>
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
                {Array.from(new Set(samplePublications.map(p => p.year)))
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
              {filteredPublications.length > 0 ? (
                filteredPublications.map(pub => (
                  <PublicationCard key={pub.id} publication={pub} />
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
              {/* Just showing a couple of recent items */}
              {samplePublications.slice(0, 4).map(pub => (
                <PublicationCard key={pub.id} publication={pub} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="notes">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {samplePublications.filter(pub => pub.notes).map(pub => (
                <PublicationCard key={pub.id} publication={pub} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="favorites">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Just showing items with high ratings */}
              {samplePublications.filter(pub => pub.rating === 5).map(pub => (
                <PublicationCard key={pub.id} publication={pub} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LiteratureManagement;
