
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
import { Publication } from "@/components/literature/PublicationCard";

const LiteratureManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchPublications = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('literature')
        .select('*') as { data: Publication[] | null, error: any };
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setPublications(data as Publication[]);
      } else {
        // 如果没有数据，检查本地存储作为备用
        const storedPublications = localStorage.getItem('literature');
        if (storedPublications) {
          setPublications(JSON.parse(storedPublications));
        }
      }
    } catch (error) {
      console.error('获取文献时出错:', error);
      toast({
        title: "错误",
        description: "加载文献失败。请重试。",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPublications();
  }, []);

  const handlePublicationDeleted = async (id: string) => {
    try {
      // 从 Supabase 删除
      const { error } = await supabase
        .from('literature')
        .delete()
        .eq('id', id) as { error: any };
      
      if (error) throw error;
      
      // 更新本地状态
      setPublications(prev => prev.filter(pub => pub.id !== id));
      
      toast({
        title: "成功",
        description: "文献删除成功",
      });
    } catch (error) {
      console.error('删除文献时出错:', error);
      toast({
        title: "错误",
        description: "删除文献失败",
        variant: "destructive",
      });
    }
  };
  
  const handleToggleSaved = async (id: string) => {
    try {
      // 找到要切换的文献
      const publication = publications.find(pub => pub.id === id);
      if (!publication) return;
      
      // 在 Supabase 中更新
      const { error } = await supabase
        .from('literature')
        .update({ saved: !publication.saved })
        .eq('id', id) as { error: any };
      
      if (error) throw error;
      
      // 更新本地状态
      setPublications(prev => prev.map(pub => 
        pub.id === id ? { ...pub, saved: !pub.saved } : pub
      ));
      
    } catch (error) {
      console.error('切换保存状态时出错:', error);
      toast({
        title: "错误",
        description: "更新保存状态失败",
        variant: "destructive",
      });
    }
  };

  // 从所有文献中获取唯一标签
  const allTags = Array.from(
    new Set(publications.flatMap(pub => pub.tags))
  ).sort();

  const filteredPublications = publications.filter(pub => {
    // 按搜索查询过滤
    const matchesSearch = !searchQuery || 
      pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pub.authors.some((a: string) => a.toLowerCase().includes(searchQuery.toLowerCase())) ||
      pub.tags.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // 按标签过滤
    const matchesTag = !selectedTag || pub.tags.includes(selectedTag);
    
    return matchesSearch && matchesTag;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">文献</h1>
        <Button onClick={() => navigate("/add-literature")}>
          <Upload className="h-4 w-4 mr-2" />
          添加文献
        </Button>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="搜索文献..." 
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
                  <SelectValue placeholder="按标签筛选" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有标签</SelectItem>
                {allTags.map(tag => (
                  <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[140px]">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="年份" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有年份</SelectItem>
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
            <TabsTrigger value="all">所有文献</TabsTrigger>
            <TabsTrigger value="recent">最近</TabsTrigger>
            <TabsTrigger value="notes">有笔记</TabsTrigger>
            <TabsTrigger value="favorites">收藏</TabsTrigger>
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
                  <h3 className="text-lg font-medium">未找到文献</h3>
                  <p className="text-sm text-muted-foreground">
                    尝试调整您的搜索或筛选条件
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
