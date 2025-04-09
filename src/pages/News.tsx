import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Bell, Calendar, Filter, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import NewsCard from "@/components/news/NewsCard";
import { useNavigate } from "react-router-dom";

const News = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [news, setNews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [savedNews, setSavedNews] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchNews = async () => {
    try {
      setIsLoading(true);
      
      // Check localStorage first
      const storedNews = localStorage.getItem('news');
      if (storedNews) {
        const parsedNews = JSON.parse(storedNews);
        setNews(parsedNews);
        setSavedNews(new Set(parsedNews.filter((n: any) => n.saved).map((n: any) => n.id)));
        setIsLoading(false);
        return;
      }
      
      // If no local storage, use sample data
      const sampleNews = [
        {
          id: '1',
          title: "New Research Grant Approved",
          content: "Our research group has been awarded a $1.5M grant for the project 'Advanced ML Techniques for Healthcare Applications'. This grant will fund our research for the next 3 years.",
          author: "Dr. David Bennett",
          authorRole: "Principal Investigator",
          date: "2025-04-05",
          type: "announcement",
          important: true,
          read: true,
          saved: true
        },
        {
          id: '2',
          title: "Weekly Meeting Change",
          content: "Starting next week, our regular group meetings will be moved to Thursdays at 2:00 PM instead of Fridays. This change accommodates the new semester schedule.",
          author: "Marie Chen",
          authorRole: "Research Coordinator",
          date: "2025-04-04",
          type: "update",
          important: true,
          read: false,
          saved: false
        },
        {
          id: '3',
          title: "Paper Accepted at NeurIPS 2025",
          content: "Our paper 'Self-Supervised Learning in Dynamic Systems' has been accepted for presentation at NeurIPS 2025. Congratulations to all authors!",
          author: "Alex Jordan",
          authorRole: "Senior Researcher",
          date: "2025-04-02",
          type: "achievement",
          read: true,
          saved: true,
        }
      ];
      
      setNews(sampleNews);
      setSavedNews(new Set(sampleNews.filter(n => n.saved).map(n => n.id)));
      
      // Save to localStorage for future use
      localStorage.setItem('news', JSON.stringify(sampleNews));
    } catch (error) {
      console.error('Error fetching news:', error);
      toast({
        title: "Error",
        description: "Failed to load news. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const toggleSaved = async (id: string) => {
    const newSavedSet = new Set(savedNews);
    const isSaved = newSavedSet.has(id);
    
    if (isSaved) {
      newSavedSet.delete(id);
    } else {
      newSavedSet.add(id);
    }
    
    setSavedNews(newSavedSet);
    
    // Update in localStorage instead of database
    const updatedNews = news.map(item => {
      if (item.id === id) {
        return { ...item, saved: !isSaved };
      }
      return item;
    });
    
    setNews(updatedNews);
    localStorage.setItem('news', JSON.stringify(updatedNews));
  };

  const handleNewsDeleted = (id: string) => {
    const updatedNews = news.filter(item => item.id !== id);
    setNews(updatedNews);
    localStorage.setItem('news', JSON.stringify(updatedNews));
    
    // Update saved set if needed
    if (savedNews.has(id)) {
      const newSavedSet = new Set(savedNews);
      newSavedSet.delete(id);
      setSavedNews(newSavedSet);
    }
  };

  const filteredNews = news.map(item => ({
    ...item,
    saved: savedNews.has(item.id)
  })).filter(item => {
    const matchesSearch = !searchQuery || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = !selectedType || item.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">News & Updates</h1>
        <Button onClick={() => navigate("/add-news")}>
          <Plus className="h-4 w-4 mr-2" />
          Add News & Updates
        </Button>
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
              ) : filteredNews.length > 0 ? (
                filteredNews.map(item => (
                  <NewsCard 
                    key={item.id} 
                    news={item}
                    toggleSaved={toggleSaved}
                    onDelete={() => handleNewsDeleted(item.id)}
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
              {filteredNews.filter(item => !item.read).map(item => (
                <NewsCard 
                  key={item.id} 
                  news={item}
                  toggleSaved={toggleSaved}
                  onDelete={() => handleNewsDeleted(item.id)}
                />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="important">
            <div className="grid grid-cols-1 gap-4">
              {filteredNews.filter(item => item.important).map(item => (
                <NewsCard 
                  key={item.id} 
                  news={item}
                  toggleSaved={toggleSaved}
                  onDelete={() => handleNewsDeleted(item.id)}
                />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="saved">
            <div className="grid grid-cols-1 gap-4">
              {filteredNews.filter(item => item.saved).map(item => (
                <NewsCard 
                  key={item.id} 
                  news={item}
                  toggleSaved={toggleSaved}
                  onDelete={() => handleNewsDeleted(item.id)}
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
