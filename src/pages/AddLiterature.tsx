import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AddLiterature = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    type: "article",
    authors: "",
    journal: "",
    year: new Date().getFullYear(),
    doi: "",
    abstract: "",
    keywords: "",
    rating: 0
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    
    try {
      // 为 Supabase 格式化数据
      const { data, error } = await supabase
        .from('literature')
        .insert({
          title: formData.title,
          authors: formData.authors.split(',').map(a => a.trim()),
          journal: formData.journal,
          year: parseInt(formData.year.toString()),
          doi: formData.doi || null,
          tags: formData.keywords.split(',').map(k => k.trim()),
          rating: 0,
          notes: false
        } as any) // 使用类型断言绕过 TypeScript 检查
        .select();
      
      if (error) throw error;
      
      toast({
        title: "成功",
        description: "文献条目添加成功",
      });
      navigate("/literature");
    } catch (error) {
      console.error('添加文献出错:', error);
      toast({
        title: "错误",
        description: "添加文献失败，请重试。",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">添加文献</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>文献详情</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">标题</Label>
              <Input 
                id="title" 
                placeholder="输入标题" 
                required 
                value={formData.title}
                onChange={handleChange}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">类型</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => handleSelectChange("type", value)}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="选择类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="article">期刊文章</SelectItem>
                    <SelectItem value="book">书籍</SelectItem>
                    <SelectItem value="conference">会议论文</SelectItem>
                    <SelectItem value="thesis">学位论文</SelectItem>
                    <SelectItem value="report">报告</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="year">出版年份</Label>
                <Input 
                  id="year" 
                  type="number" 
                  value={formData.year}
                  onChange={handleChange}
                  min={1900}
                  max={new Date().getFullYear() + 1}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="authors">作者</Label>
              <Input 
                id="authors" 
                placeholder="作者（用逗号分隔）" 
                required 
                value={formData.authors}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="journal">来源/期刊/出版社</Label>
              <Input 
                id="journal" 
                placeholder="出版来源" 
                value={formData.journal}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="abstract">摘要</Label>
              <Textarea 
                id="abstract" 
                placeholder="输入摘要或总结..." 
                rows={4}
                value={formData.abstract}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="keywords">关键词</Label>
              <Input 
                id="keywords" 
                placeholder="关键词用逗号分隔" 
                value={formData.keywords}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="doi">DOI（数字对象标识符）</Label>
              <Input 
                id="doi" 
                placeholder="例如：10.1000/xyz123" 
                value={formData.doi}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">上传PDF（可选）</Label>
              <Input id="file" type="file" accept=".pdf" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => navigate("/literature")}>
              取消
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "添加中..." : "添加文献"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AddLiterature;
