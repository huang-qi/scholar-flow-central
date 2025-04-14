
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAppContext } from "@/context/AppContext";

const AddTool = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { userProfile } = useAppContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
    tags: "",
    hasDocumentation: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, type: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, hasDocumentation: checked }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!formData.name || !formData.type || !formData.description) {
      toast({
        title: "必填字段缺失",
        description: "请填写所有必填字段",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // 将标签从逗号分隔的字符串解析为数组
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      
      // 将工具插入到 Supabase
      const { data, error } = await supabase
        .from('tools')
        .insert({
          name: formData.name,
          description: formData.description,
          type: formData.type,
          tags: tags,
          author: userProfile.name,
          has_documentation: formData.hasDocumentation,
        });
        
      if (error) throw error;
      
      toast({
        title: "成功",
        description: "工具添加成功",
      });
      
      navigate("/tools");
    } catch (error) {
      console.error("添加工具时出错:", error);
      toast({
        title: "错误",
        description: "添加工具失败。请重试。",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">添加新工具</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>工具详情</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">工具名称</Label>
              <Input 
                id="name" 
                placeholder="输入工具名称" 
                required 
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">工具类型</Label>
              <Select onValueChange={handleSelectChange} value={formData.type}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="选择类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="api">API</SelectItem>
                  <SelectItem value="library">库</SelectItem>
                  <SelectItem value="framework">框架</SelectItem>
                  <SelectItem value="utility">实用工具</SelectItem>
                  <SelectItem value="dataset">数据集</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">描述</Label>
              <Textarea 
                id="description" 
                placeholder="描述此工具的功能..." 
                rows={4}
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">标签</Label>
              <Input 
                id="tags" 
                placeholder="添加标签，用逗号分隔（例如：AI、ML、NLP）" 
                value={formData.tags}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch 
                id="hasDocumentation" 
                checked={formData.hasDocumentation}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="hasDocumentation">有文档</Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => navigate("/tools")}>
              取消
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "添加中..." : "添加工具"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AddTool;
