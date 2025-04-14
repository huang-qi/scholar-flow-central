
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
import { useAppContext } from "@/context/AppContext";

const AddReport = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { userProfile } = useAppContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    type: "",
    dueDate: "",
    description: "",
    contributors: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, type: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!formData.title || !formData.type) {
      toast({
        title: "必填字段缺失",
        description: "请填写所有必填字段",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // 将逗号分隔的字符串解析为数组
      const keywords = formData.contributors
        .split(',')
        .map(keyword => keyword.trim())
        .filter(keyword => keyword.length > 0);
      
      // 将报告插入到 Supabase
      const { data, error } = await supabase
        .from('reports')
        .insert({
          title: formData.title,
          type: formData.type,
          content: formData.description,
          author: userProfile.name,
          keywords: keywords,
          date: formData.dueDate || new Date().toISOString(),
        });
        
      if (error) throw error;
      
      toast({
        title: "成功",
        description: "报告添加成功",
      });
      
      navigate("/reports");
    } catch (error) {
      console.error("添加报告时出错:", error);
      toast({
        title: "错误",
        description: "添加报告失败。请重试。",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">添加新报告</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>报告详情</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">报告标题</Label>
              <Input 
                id="title" 
                placeholder="输入报告标题" 
                required 
                value={formData.title}
                onChange={handleChange}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">报告类型</Label>
                <Select onValueChange={handleSelectChange} value={formData.type}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="选择类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="progress">进度报告</SelectItem>
                    <SelectItem value="final">最终报告</SelectItem>
                    <SelectItem value="summary">摘要报告</SelectItem>
                    <SelectItem value="analysis">分析报告</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dueDate">截止日期</Label>
                <Input 
                  id="dueDate" 
                  type="date" 
                  value={formData.dueDate}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">描述</Label>
              <Textarea 
                id="description" 
                placeholder="描述报告内容和范围..." 
                rows={5}
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contributors">贡献者</Label>
              <Input 
                id="contributors" 
                placeholder="添加贡献者（用逗号分隔）" 
                value={formData.contributors}
                onChange={handleChange}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => navigate("/reports")}>
              取消
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "创建中..." : "创建报告"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AddReport;
