
import GuidelineItem from "@/components/guidelines/GuidelineItem";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Search, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Guidelines = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [guidelines, setGuidelines] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchGuidelines = async () => {
    try {
      setIsLoading(true);
      // 首先检查本地存储中的指南
      const localGuidelines = localStorage.getItem('guidelines');
      let guidelineData: any[] = [];
      
      if (localGuidelines) {
        guidelineData = JSON.parse(localGuidelines);
      }
      
      // 现在尝试从 Supabase 获取数据
      try {
        const { data, error } = await supabase
          .from('guidelines')
          .select('*');
        
        if (data && data.length > 0) {
          // 格式化数据以匹配组件的预期格式
          const formattedGuidelines = data.map(item => ({
            id: item.id,
            title: item.title,
            category: item.category,
            version: item.version || "1.0",
            lastUpdated: item.updated_at,
            description: item.content,
            fileName: `${item.title.toLowerCase().replace(/\s+/g, '_')}.pdf`
          }));
          
          // 将 Supabase 指南添加到本地指南中
          guidelineData = [...formattedGuidelines, ...guidelineData];
        }
      } catch (error) {
        console.error("Supabase 获取错误:", error);
        // 仅继续使用本地数据
      }
      
      if (guidelineData.length === 0) {
        // 如果数据库或本地存储中没有数据，则使用示例数据
        const sampleGuidelines = [
          {
            id: "1",
            title: "研究论文提交指南",
            category: "论文提交",
            version: "2.3",
            lastUpdated: "2025-02-15",
            description: "向会议和期刊提交论文的标准程序",
            fileName: "paper_submission_guidelines.pdf"
          },
          {
            id: "2",
            title: "代码仓库标准",
            category: "代码管理",
            version: "1.5",
            lastUpdated: "2025-03-10",
            description: "组织和记录代码仓库的指南",
            fileName: "code_repository_standards.pdf"
          },
          {
            id: "3",
            title: "周报模板",
            category: "报告",
            version: "3.1",
            lastUpdated: "2025-04-01",
            description: "每周研究进展报告的模板和说明",
            fileName: "weekly_report_template.docx"
          }
        ];
        guidelineData = sampleGuidelines;
      }
      
      // 按 id 删除重复项
      const uniqueGuidelines = Array.from(
        new Map(guidelineData.map(item => [item.id, item])).values()
      );
      
      setGuidelines(uniqueGuidelines);
    } catch (error) {
      console.error('获取指南时出错:', error);
      toast({
        title: "错误",
        description: "加载指南失败。请重试。",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGuidelines();
  }, []);

  const handleGuidelineDeleted = () => {
    fetchGuidelines();
  };

  // 根据搜索查询过滤指南
  const filteredGuidelines = guidelines.filter(guideline =>
    guideline.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guideline.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guideline.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const guidelinesByCategory = filteredGuidelines.reduce((acc, guideline) => {
    if (!acc[guideline.category]) {
      acc[guideline.category] = [];
    }
    acc[guideline.category].push(guideline);
    return acc;
  }, {} as Record<string, typeof filteredGuidelines>);
  
  const filteredCategories = Object.keys(guidelinesByCategory).filter(category =>
    category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guidelinesByCategory[category].some(guideline => 
      guideline.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guideline.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">指南与规范</h1>
        <Button onClick={() => navigate("/add-guideline")}>
          <Upload className="h-4 w-4 mr-2" />
          添加指南
        </Button>
      </div>

      <div className="space-y-6">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="搜索指南..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="space-y-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="space-y-2">
                    <div className="h-4 w-2/3 bg-gray-200 rounded" />
                    <div className="h-3 w-1/2 bg-gray-200 rounded" />
                  </CardHeader>
                  <CardContent className="h-12" />
                </Card>
              ))}
            </div>
          ) : searchQuery ? (
            filteredGuidelines.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredGuidelines.map(guideline => (
                  <GuidelineItem 
                    key={guideline.id} 
                    guideline={guideline}
                    onDelete={handleGuidelineDeleted}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">未找到指南</h3>
                <p className="text-sm text-muted-foreground">
                  请尝试调整搜索条件
                </p>
              </div>
            )
          ) : (
            <Accordion type="multiple" className="w-full">
              {filteredCategories.map(category => (
                <AccordionItem key={category} value={category}>
                  <AccordionTrigger className="hover:bg-secondary/50 px-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>{category}</span>
                      <Badge className="ml-2" variant="outline">
                        {guidelinesByCategory[category].length}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 px-2">
                      {guidelinesByCategory[category].map(guideline => (
                        <GuidelineItem 
                          key={guideline.id} 
                          guideline={guideline}
                          onDelete={handleGuidelineDeleted}
                        />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </div>
    </div>
  );
};

export default Guidelines;
