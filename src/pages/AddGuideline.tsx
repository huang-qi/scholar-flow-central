import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

const AddGuideline = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
    version: "1.0",
    isMandatory: false,
    file: null as File | null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, file }));
  };
  
  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isMandatory: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.category || !formData.content) {
      toast({
        title: "缺少信息",
        description: "请填写所有必填字段",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // 创建包含所有数据的指南对象
      const newGuideline = {
        id: uuidv4(),
        title: formData.title,
        category: formData.category,
        version: formData.version,
        description: formData.content,
        lastUpdated: new Date().toISOString(),
        fileName: formData.file ? formData.file.name : `${formData.title.toLowerCase().replace(/\s+/g, '_')}.pdf`
      };
      
      // 首先尝试保存到Supabase
      try {
        const { error } = await supabase.from('guidelines')
          .insert({
            title: formData.title,
            category: formData.category,
            content: formData.content,
            version: formData.version,
            is_mandatory: formData.isMandatory
          });
          
        if (error) {
          console.error("保存到Supabase时出错:", error);
          throw error;
        }
      } catch (error) {
        console.error("保存到数据库失败，改为保存到localStorage:", error);
        
        // 回退到localStorage
        const existingGuidelines = JSON.parse(localStorage.getItem('guidelines') || '[]');
        existingGuidelines.push(newGuideline);
        localStorage.setItem('guidelines', JSON.stringify(existingGuidelines));
      }
      
      toast({
        title: "成功",
        description: "指南添加成功",
      });
      
      navigate("/guidelines");
    } catch (error) {
      console.error('添加指南时出错:', error);
      toast({
        title: "错误",
        description: "添加指南失败。请重试。",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">添加指南</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>指南详情</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">标题</Label>
              <Input 
                id="title" 
                name="title" 
                placeholder="输入标题" 
                value={formData.title}
                onChange={handleInputChange}
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">类别</Label>
              <Select 
                value={formData.category} 
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="选择类别" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Manuscript Submission">手稿提交</SelectItem>
                  <SelectItem value="Code Management">代码管理</SelectItem>
                  <SelectItem value="Reporting">报告</SelectItem>
                  <SelectItem value="Data Management">数据管理</SelectItem>
                  <SelectItem value="Ethics">伦理</SelectItem>
                  <SelectItem value="Collaboration">协作</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="version">版本</Label>
              <Input 
                id="version" 
                name="version"
                value={formData.version} 
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">内容</Label>
              <Textarea 
                id="content" 
                name="content"
                placeholder="输入指南内容..." 
                rows={6}
                value={formData.content}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="mandatory" 
                checked={formData.isMandatory}
                onCheckedChange={handleCheckboxChange}
              />
              <Label htmlFor="mandatory" className="font-medium cursor-pointer">
                此指南为必需
              </Label>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="file">上传文件（可选）</Label>
              <Input 
                id="file" 
                type="file" 
                onChange={handleFileChange}
              />
              <p className="text-xs text-muted-foreground">
                支持的格式：PDF、DOCX、TXT（最大大小：5MB）
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => navigate("/guidelines")}>
              取消
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "添加中..." : "添加指南"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AddGuideline;
