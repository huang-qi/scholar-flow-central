
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, Book, FileText, Wrench, User, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BarChart } from "@/components/charts/BarChart";
import { useAppContext } from "@/context/AppContext";

const ActivityHeatmap = () => {
  const generateActivityData = () => {
    const today = new Date();
    const daysToShow = 90; // ~3个月
    const data = [];
    
    for (let i = daysToShow; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      
      const level = Math.floor(Math.random() * 5);
      
      data.push({
        date: date.toISOString().split('T')[0],
        level,
      });
    }
    
    return data;
  };

  const activityData = generateActivityData();

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium">活动贡献</div>
      <div className="flex flex-wrap gap-1">
        {activityData.map((day) => (
          <div
            key={day.date}
            title={`${day.date}: ${day.level} 项贡献`}
            className={`h-3 w-3 rounded-sm ${
              day.level === 0
                ? "bg-gray-100"
                : day.level === 1
                ? "bg-accent/30"
                : day.level === 2
                ? "bg-accent/50"
                : day.level === 3
                ? "bg-accent/70"
                : "bg-accent"
            }`}
          />
        ))}
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <div>较少</div>
        <div>较多</div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { userProfile, isProfileLoading } = useAppContext();

  const contributionData = {
    categories: ["报告", "文献", "研究", "工具", "评论"],
    series: [
      {
        name: "贡献",
        data: [12, 5, 8, 3, 20],
      },
    ],
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">仪表板</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-xl">
                {isProfileLoading ? "加载中..." : `欢迎，${userProfile.name.split(' ')[0]}`}
              </CardTitle>
              <CardDescription>
                这是您研究小组的最新动态
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon">
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={userProfile.avatar} />
                <AvatarFallback>{getInitials(userProfile.name)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{userProfile.name}</h3>
                <p className="text-sm text-muted-foreground">{userProfile.title}</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {userProfile.tags && userProfile.tags.map(tag => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">您的贡献</h3>
              <ActivityHeatmap />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">最近活动</CardTitle>
            <CardDescription>来自团队的最新更新</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Marie 上传了一份周报</p>
                <p className="text-xs text-muted-foreground">2小时前</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10">
                <Book className="h-4 w-4 text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium">Alex 添加了3篇论文到文献库</p>
                <p className="text-xs text-muted-foreground">昨天</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <Wrench className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">新AI工具已添加："图像分割API"</p>
                <p className="text-xs text-muted-foreground">3天前</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10">
                <User className="h-4 w-4 text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium">Robin 加入了研究小组</p>
                <p className="text-xs text-muted-foreground">1周前</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">研究概览</TabsTrigger>
          <TabsTrigger value="reports">最近报告</TabsTrigger>
          <TabsTrigger value="literature">文献更新</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">周报</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">比上月增加2份</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">添加的论文</CardTitle>
                <Book className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">28</div>
                <p className="text-xs text-muted-foreground">自上月以来增加8篇</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">活跃讨论</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7</div>
                <p className="text-xs text-muted-foreground">今天新增1个讨论</p>
              </CardContent>
            </Card>
          </div>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>研究成果分布</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <BarChart
                categories={contributionData.categories}
                series={contributionData.series}
                height={300}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>最近报告</CardTitle>
              <CardDescription>
                团队的最新研究报告
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {["NLP模型的每周进展", "计算机视觉研究更新", "协作研究结果", "模型性能分析"].map((report, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{report}</p>
                      <p className="text-xs text-muted-foreground">
                        {["Marie Chen", "Alex Jordan", "团队协作", "Robin Taylor"][i]} • {["2小时前", "1天前", "2天前", "1周前"][i]}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    查看
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="literature" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>文献更新</CardTitle>
              <CardDescription>
                最近添加的论文和研究文献
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                "视觉任务中Transformer架构的进展",
                "机器人应用中强化学习的调查",
                "自监督学习的最新进展",
                "多模态基础模型：综合调查"
              ].map((paper, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10">
                      <Book className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{paper}</p>
                      <p className="text-xs text-muted-foreground">
                        由 {["Alex", "Marie", "Robin", "David"][i]} 添加 • {i === 0 ? "今天" : ["3天前", "1周前", "2周前"][i-1]}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    查看
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
