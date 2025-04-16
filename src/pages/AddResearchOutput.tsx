import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AddResearchOutput = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    outputType: "paper",
    status: "published",
    date: new Date().toISOString().split('T')[0],
    authors: "",
    description: "",
    link: "",
    venue: "",
    tags: ""
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
      // 将日期格式化为年份
      const year = new Date(formData.date).getFullYear();
      
      // 为 Supabase 格式化数据
      const { data, error } = await supabase
        .from('research_outputs')
        .insert({
          title: formData.title,
          type: formData.outputType,
          authors: formData.authors.split(',').map(a => a.trim()),
          year: year,
          venue: formData.venue || null,
          link: formData.link || null,
          tags: formData.tags.split(',').filter(t => t.trim()).map(t => t.trim()),
          citations: 0
        })
        .select();
      
      if (error) throw error;
      
      toast({
        title: "成功",
        description: "研究成果添加成功",
      });
      navigate("/research");
    } catch (error) {
      console.error('添加研究成果时出错:', error);
      toast({
        title: "错误",
        description: "添加研究成果失败。请重试。",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">添加研究成果</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>成果详情</CardTitle>
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
            
            <div className="space-y-4">
              <Label>成果类型</Label>
              <RadioGroup 
                defaultValue="paper" 
                className="grid grid-cols-3 gap-4" 
                value={formData.outputType}
                onValueChange={(value) => handleSelectChange("outputType", value)}
              >
                <Label htmlFor="paper" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                  <RadioGroupItem value="paper" id="paper" className="sr-only" />
                  <span>学术论文</span>
                </Label>
                <Label htmlFor="code" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                  <RadioGroupItem value="code" id="code" className="sr-only" />
                  <span>代码仓库</span>
                </Label>
                <Label htmlFor="patent" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                  <RadioGroupItem value="patent" id="patent" className="sr-only" />
                  <span>专利</span>
                </Label>
              </RadioGroup>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">状态</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="选择状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">草稿</SelectItem>
                    <SelectItem value="submitted">已提交</SelectItem>
                    <SelectItem value="review">审核中</SelectItem>
                    <SelectItem value="published">已发表</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date">日期</Label>
                <Input 
                  id="date" 
                  type="date" 
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="authors">作者/贡献者</Label>
              <Input 
                id="authors" 
                placeholder="姓名用逗号分隔" 
                required
                value={formData.authors}
                onChange={handleChange}
              />
            </div>
            
            {formData.outputType === 'paper' && (
              <div className="space-y-2">
                <Label htmlFor="venue">期刊/会议</Label>
                <Input 
                  id="venue" 
                  placeholder="发表在哪里" 
                  value={formData.venue}
                  onChange={handleChange}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="description">描述/摘要</Label>
              <Textarea 
                id="description" 
                placeholder="描述研究成果..." 
                rows={4}
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="link">外部链接</Label>
              <Input 
                id="link" 
                placeholder="论文、代码仓库或专利的URL" 
                value={formData.link}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags">关键词/标签</Label>
              <Input 
                id="tags" 
                placeholder="用逗号分隔标签（如：自然语言处理, 机器学习）" 
                value={formData.tags}
                onChange={handleChange}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => navigate("/research")}>
              取消
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "添加中..." : "添加研究成果"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AddResearchOutput;
