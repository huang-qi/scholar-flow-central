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
      
      // 首先检查本地存储
      const storedNews = localStorage.getItem('news');
      if (storedNews) {
        const parsedNews = JSON.parse(storedNews);
        setNews(parsedNews);
        setSavedNews(new Set(parsedNews.filter((n: any) => n.saved).map((n: any) => n.id)));
        setIsLoading(false);
        return;
      }
      
      // 如果没有本地存储，使用示例数据
      const sampleNews = [
        {
          id: '1',
          title: "新研究经费获批",
          content: "我们的研究团队获得了150万美元的项目经费，用于'医疗保健应用中的高级机器学习技术'项目。这笔经费将资助我们未来3年的研究。",
          author: "David Bennett博士",
          authorRole: "首席研究员",
          date: "2025-04-05",
          type: "announcement",
          important: true,
          read: true,
          saved: true
        },
        {
          id: '2',
          title: "每周会议时间变更",
          content: "从下周开始，我们的例行小组会议将从周五改到周四下午2:00。这一变更是为了适应新学期的时间安排。",
          author: "陈玛丽",
          authorRole: "研究协调员",
          date: "2025-04-04",
          type: "update",
          important: true,
          read: false,
          saved: false
        },
        {
          id: '3',
          title: "论文被NeurIPS 2025接收",
          content: "我们的论文'动态系统中的自监督学习'已被接收并将在NeurIPS 2025会议上展示。恭喜所有作者！",
          author: "Alex Jordan",
          authorRole: "高级研究员",
          date: "2025-04-02",
          type: "achievement",
          read: true,
          saved: true,
        }
      ];
      
      setNews(sampleNews);
      setSavedNews(new Set(sampleNews.filter(n => n.saved).map(n => n.id)));
      
      // 保存到本地存储以供将来使用
      localStorage.setItem('news', JSON.stringify(sampleNews));
    } catch (error) {
      console.error('获取新闻时出错:', error);
      toast({
        title: "错误",
        description: "加载新闻失败。请重试。",
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
    
    // 更新本地存储而不是数据库
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
    
    // 如果需要，更新已保存集合
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
        <h1 className="text-3xl font-bold tracking-tight">新闻与更新</h1>
        <Button onClick={() => navigate("/add-news")}>
          <Plus className="h-4 w-4 mr-2" />
          添加新闻与更新
        </Button>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="搜索新闻..." 
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
                  <SelectValue placeholder="按类型筛选" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有类型</SelectItem>
                <SelectItem value="announcement">公告</SelectItem>
                <SelectItem value="update">更新</SelectItem>
                <SelectItem value="event">活动</SelectItem>
                <SelectItem value="achievement">成就</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">全部新闻</TabsTrigger>
            <TabsTrigger value="unread">未读</TabsTrigger>
            <TabsTrigger value="important">重要</TabsTrigger>
            <TabsTrigger value="saved">已保存</TabsTrigger>
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
                  <h3 className="text-lg font-medium">未找到新闻</h3>
                  <p className="text-sm text-muted-foreground">
                    请尝试调整搜索或筛选条件
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
