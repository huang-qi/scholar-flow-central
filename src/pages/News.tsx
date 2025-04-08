
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Bell, Calendar, Filter, Bookmark, BookmarkCheck, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NewsItem {
  id: number;
  title: string;
  content: string;
  author: string;
  authorRole?: string;
  authorAvatar?: string;
  date: string;
  type: "announcement" | "update" | "event" | "achievement";
  important?: boolean;
  read?: boolean;
  saved?: boolean;
}

const sampleNews: NewsItem[] = [
  {
    id: 1,
    title: "New Research Grant Approved",
    content: "Our research group has been awarded a $1.5M grant for the project 'Advanced ML Techniques for Healthcare Applications'. This grant will fund our research for the next 3 years.",
    author: "Dr. David Bennett",
    authorRole: "Principal Investigator",
    date: "2025-04-05",
    type: "announcement",
    important: true,
    read: true,
  },
  {
    id: 2,
    title: "Weekly Meeting Change",
    content: "Starting next week, our regular group meetings will be moved to Thursdays at 2:00 PM instead of Fridays. This change accommodates the new semester schedule.",
    author: "Marie Chen",
    authorRole: "Research Coordinator",
    date: "2025-04-04",
    type: "update",
    important: true,
  },
  {
    id: 3,
    title: "Paper Accepted at NeurIPS 2025",
    content: "Our paper 'Self-Supervised Learning in Dynamic Systems' has been accepted for presentation at NeurIPS 2025. Congratulations to all authors!",
    author: "Alex Jordan",
    authorRole: "Senior Researcher",
    date: "2025-04-02",
    type: "achievement",
    read: true,
    saved: true,
  },
  {
    id: 4,
    title: "New Tool Library Feature",
    content: "We've added a new feature to the AI Tool Library that allows for real-time collaboration on tool development. Check out the documentation in the Tools section.",
    author: "Robin Taylor",
    authorRole: "Systems Developer",
    date: "2025-03-30",
    type: "update",
  },
  {
    id: 5,
    title: "Upcoming Workshop: Advanced NLP Techniques",
    content: "We're organizing a workshop on Advanced NLP Techniques on April 15th. All group members are invited to participate. External speakers include Prof. Emily Johnson (Stanford) and Dr. Michael Zhang (MIT).",
    author: "Marie Chen",
    authorRole: "Research Coordinator",
    date: "2025-03-28",
    type: "event",
    important: true,
  },
  {
    id: 6,
    title: "Annual Research Symposium",
    content: "The annual departmental research symposium is scheduled for May 20-21. All research groups are expected to present their latest work. Please prepare your materials.",
    author: "Department Office",
    date: "2025-03-25",
    type: "event",
    read: true,
  }
];

const getTypeColor = (type: string) => {
  switch(type) {
    case "announcement": return "bg-blue-500/10 text-blue-500";
    case "update": return "bg-emerald-500/10 text-emerald-500";
    case "event": return "bg-purple-500/10 text-purple-500";
    case "achievement": return "bg-amber-500/10 text-amber-500";
    default: return "bg-gray-500/10 text-gray-500";
  }
};

const NewsCard = ({ news, toggleSaved }: { news: NewsItem, toggleSaved: (id: number) => void }) => {
  const typeColor = getTypeColor(news.type);

  return (
    <Card className={`card-hover ${news.read ? 'bg-background' : 'bg-secondary/30'}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <div className="flex gap-2 items-center">
            <Badge className={typeColor + " capitalize"}>
              {news.type}
            </Badge>
            {news.important && (
              <Badge variant="destructive">Important</Badge>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => toggleSaved(news.id)}
          >
            {news.saved ? (
              <BookmarkCheck className="h-5 w-5 text-primary" />
            ) : (
              <Bookmark className="h-5 w-5" />
            )}
          </Button>
        </div>
        <CardTitle className="text-lg">{news.title}</CardTitle>
        <CardDescription className="flex items-center gap-2">
          <span>{new Date(news.date).toLocaleDateString()}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm">{news.content}</p>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={news.authorAvatar || "/placeholder.svg"} />
              <AvatarFallback>
                {news.author.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <span className="font-medium">{news.author}</span>
              {news.authorRole && (
                <span className="text-xs text-muted-foreground ml-1">
                  ({news.authorRole})
                </span>
              )}
            </div>
          </div>
          {!news.read && (
            <Button size="sm" variant="ghost">
              <Eye className="h-4 w-4 mr-1" />
              Mark as read
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const News = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [savedNews, setSavedNews] = useState<Set<number>>(
    new Set(sampleNews.filter(n => n.saved).map(n => n.id))
  );

  const toggleSaved = (id: number) => {
    const newSaved = new Set(savedNews);
    if (newSaved.has(id)) {
      newSaved.delete(id);
    } else {
      newSaved.add(id);
    }
    setSavedNews(newSaved);
  };

  // Filter news items
  const filteredNews = sampleNews.filter(news => {
    // Update saved status based on state
    news.saved = savedNews.has(news.id);
    
    // Filter by search
    const matchesSearch = !searchQuery || 
      news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      news.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      news.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by type
    const matchesType = !selectedType || news.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">News & Updates</h1>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search news..." 
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
                <SelectItem value="announcement">Announcements</SelectItem>
                <SelectItem value="update">Updates</SelectItem>
                <SelectItem value="event">Events</SelectItem>
                <SelectItem value="achievement">Achievements</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All News</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="important">Important</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {filteredNews.length > 0 ? (
                filteredNews.map(news => (
                  <NewsCard 
                    key={news.id} 
                    news={news}
                    toggleSaved={toggleSaved}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No news found</h3>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="unread">
            <div className="grid grid-cols-1 gap-4">
              {filteredNews.filter(news => !news.read).map(news => (
                <NewsCard 
                  key={news.id} 
                  news={news}
                  toggleSaved={toggleSaved}
                />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="important">
            <div className="grid grid-cols-1 gap-4">
              {filteredNews.filter(news => news.important).map(news => (
                <NewsCard 
                  key={news.id} 
                  news={news}
                  toggleSaved={toggleSaved}
                />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="saved">
            <div className="grid grid-cols-1 gap-4">
              {filteredNews.filter(news => news.saved).map(news => (
                <NewsCard 
                  key={news.id} 
                  news={news}
                  toggleSaved={toggleSaved}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default News;
