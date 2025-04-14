
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppContext } from "@/context/AppContext";
import { v4 as uuidv4 } from 'uuid';

const AddNews = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { userProfile } = useAppContext();
  
  const [newsData, setNewsData] = useState({
    title: "",
    content: "",
    type: "" as "announcement" | "update" | "event" | "achievement",
    important: false,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewsData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setNewsData(prev => ({ ...prev, type: value as "announcement" | "update" | "event" | "achievement" }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setNewsData(prev => ({ ...prev, important: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newsData.title.trim() || !newsData.content.trim() || !newsData.type) {
      toast({
        title: "信息缺失",
        description: "请填写所有必填字段。",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // 创建新闻条目
      const newNewsItem = {
        id: uuidv4(),
        title: newsData.title,
        content: newsData.content,
        author: userProfile.name,
        authorRole: userProfile.title,
        authorAvatar: userProfile.avatar,
        date: new Date().toISOString(),
        type: newsData.type,
        important: newsData.important,
        read: false,
        saved: false
      };
      
      // 存储到localStorage
      const existingNews = JSON.parse(localStorage.getItem('news') || '[]');
      existingNews.unshift(newNewsItem); // 添加到数组开头
      localStorage.setItem('news', JSON.stringify(existingNews));
      
      toast({
        title: "成功",
        description: "新闻条目添加成功",
      });
      navigate("/news");
    } catch (error) {
      console.error("添加新闻时出错:", error);
      toast({
        title: "添加新闻失败",
        description: "发生错误。请重试。",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">添加新闻与更新</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>创建新闻条目</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">标题</Label>
              <Input 
                id="title" 
                name="title" 
                placeholder="输入标题" 
                value={newsData.title}
                onChange={handleInputChange}
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">内容</Label>
              <Textarea
                id="content"
                name="content"
                placeholder="输入新闻内容..."
                rows={6}
                value={newsData.content}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">类型</Label>
                <Select 
                  value={newsData.type} 
                  onValueChange={handleSelectChange} 
                  required
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="选择类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="announcement">公告</SelectItem>
                    <SelectItem value="update">更新</SelectItem>
                    <SelectItem value="event">活动</SelectItem>
                    <SelectItem value="achievement">成就</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2 h-full">
                <Checkbox 
                  id="important" 
                  checked={newsData.important}
                  onCheckedChange={handleCheckboxChange}
                />
                <Label htmlFor="important" className="font-medium cursor-pointer">
                  标记为重要
                </Label>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => navigate("/news")}>
              取消
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "添加中..." : "添加新闻"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AddNews;
