
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowRight, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="w-full max-w-3xl shadow-lg border-2 border-primary/10">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold text-primary">学术研究管理平台</CardTitle>
          <CardDescription className="text-xl mt-2">
            您的综合研究管理平台
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <FeatureCard 
              title="管理研究"
              description="在一个平台上组织出版物、数据集和研究成果"
              icon="📚"
            />
            <FeatureCard 
              title="追踪进度"
              description="监控研究里程碑和发表状态"
              icon="📈"
            />
            <FeatureCard 
              title="协作"
              description="与团队分享见解并共同工作"
              icon="👥"
            />
            <FeatureCard 
              title="保持更新"
              description="获取相关文献和出版物的最新信息"
              icon="🔔"
            />
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg flex items-center gap-3">
            <Info className="h-5 w-5 text-muted-foreground shrink-0" />
            <p className="text-muted-foreground text-sm">
              通过导航到仪表板或探索研究成果开始使用。
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-center gap-4">
          <Button 
            variant="default" 
            size="lg" 
            className="gap-2"
            onClick={() => navigate('/dashboard')}
          >
            前往仪表板
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate('/research')}
          >
            了解更多
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

// 功能卡组件
const FeatureCard = ({ title, description, icon }: { title: string, description: string, icon: string }) => {
  return (
    <div className="bg-card rounded-lg p-4 border shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div className="text-2xl">{icon}</div>
        <div>
          <h3 className="font-medium text-card-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
