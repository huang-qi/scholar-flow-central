
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Search, BarChart2, FileText, Upload, Filter
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
import { BarChart } from "@/components/charts/BarChart";
import OutputCard from "@/components/research/OutputCard";

const ResearchOutput = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [outputs, setOutputs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchOutputs = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('research_outputs')
        .select('*');
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setOutputs(data);
      } else {
        // 如果数据库中没有记录，则使用示例数据
        const sampleOutputs = [
          {
            id: "1",
            title: "探索医学图像分类的半监督学习",
            type: "paper",
            authors: ["David Bennett", "Marie Chen", "James Wilson"],
            year: 2024,
            venue: "IEEE医学影像学会会刊",
            tags: ["医学影像", "半监督", "CNN"],
            citations: 12
          },
          {
            id: "2",
            title: "EfficientCV：移动视觉模型轻量级框架",
            type: "code",
            authors: ["Alex Jordan", "Robin Taylor"],
            year: 2024,
            link: "https://github.com/example/efficientcv",
            tags: ["计算机视觉", "移动", "效率"],
            citations: 8
          },
          {
            id: "3",
            title: "实时情感分析方法与系统",
            type: "patent",
            authors: ["David Bennett", "Marie Chen"],
            year: 2023,
            venue: "美国专利局, #US123456789",
            tags: ["NLP", "情感分析", "实时"],
            citations: 3
          }
        ];
        
        // 如果需要，插入示例数据
        if (data.length === 0) {
          for (const sample of sampleOutputs) {
            await supabase.from('research_outputs').insert(sample);
          }
          setOutputs(sampleOutputs);
        }
      }
    } catch (error) {
      console.error('获取研究成果时出错:', error);
      toast({
        title: "错误",
        description: "加载研究成果失败。请重试。",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOutputs();
  }, []);

  const handleOutputDeleted = async (id: string) => {
    try {
      // 从 Supabase 删除
      const { error } = await supabase
        .from('research_outputs')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // 更新本地状态
      setOutputs(prev => prev.filter(output => output.id !== id));
      
      toast({
        title: "成功",
        description: "研究成果删除成功",
      });
    } catch (error) {
      console.error('删除研究成果时出错:', error);
      toast({
        title: "错误",
        description: "删除研究成果失败",
        variant: "destructive",
      });
    }
  };

  // 获取用于筛选的年份
  const years = outputs.length > 0 
    ? Array.from(new Set(outputs.map(output => output.year))).sort((a, b) => b - a)
    : [];

  // 可视化数据
  const outputsByYear = years.map(year => {
    const papers = outputs.filter(o => o.year === year && o.type === "paper").length;
    const codes = outputs.filter(o => o.year === year && o.type === "code").length;
    const patents = outputs.filter(o => o.year === year && o.type === "patent").length;
    return { year, papers, codes, patents };
  });

  const chartData = {
    categories: years.map(year => year.toString()),
    series: [
      {
        name: "论文",
        data: outputsByYear.map(item => item.papers),
      },
      {
        name: "代码",
        data: outputsByYear.map(item => item.codes),
      },
      {
        name: "专利",
        data: outputsByYear.map(item => item.patents),
      },
    ],
  };

  const filteredOutputs = outputs.filter(output => {
    // 按搜索查询过滤
    const matchesSearch = !searchQuery || 
      output.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      output.authors.some((a: string) => a.toLowerCase().includes(searchQuery.toLowerCase())) ||
      output.tags.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // 按类型过滤
    const matchesType = !selectedType || output.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">研究成果</h1>
        <Button onClick={() => navigate("/add-output")}>
          <Upload className="h-4 w-4 mr-2" />
          添加成果
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>成果分布</CardTitle>
          <CardDescription>
            按年份和类型划分的研究成果
          </CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          {years.length > 0 ? (
            <BarChart
              categories={chartData.categories}
              series={chartData.series}
              height={300}
              type="bar"
            />
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              没有可供图表可视化的数据
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="搜索成果..." 
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
                <SelectItem value="paper">论文</SelectItem>
                <SelectItem value="code">代码</SelectItem>
                <SelectItem value="patent">专利</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">所有成果</TabsTrigger>
            <TabsTrigger value="papers">论文</TabsTrigger>
            <TabsTrigger value="code">代码</TabsTrigger>
            <TabsTrigger value="patents">专利</TabsTrigger>
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
              ) : filteredOutputs.length > 0 ? (
                filteredOutputs.map(output => (
                  <OutputCard 
                    key={output.id} 
                    output={output}
                    onDelete={() => handleOutputDeleted(output.id)} 
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <BarChart2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">未找到成果</h3>
                  <p className="text-sm text-muted-foreground">
                    尝试调整您的搜索或筛选条件
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="papers">
            <div className="grid grid-cols-1 gap-4">
              {!isLoading && filteredOutputs
                .filter(output => output.type === "paper")
                .map(output => (
                  <OutputCard 
                    key={output.id} 
                    output={output}
                    onDelete={() => handleOutputDeleted(output.id)} 
                  />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="code">
            <div className="grid grid-cols-1 gap-4">
              {!isLoading && filteredOutputs
                .filter(output => output.type === "code")
                .map(output => (
                  <OutputCard 
                    key={output.id} 
                    output={output}
                    onDelete={() => handleOutputDeleted(output.id)} 
                  />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="patents">
            <div className="grid grid-cols-1 gap-4">
              {!isLoading && filteredOutputs
                .filter(output => output.type === "patent")
                .map(output => (
                  <OutputCard 
                    key={output.id} 
                    output={output}
                    onDelete={() => handleOutputDeleted(output.id)} 
                  />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ResearchOutput;
