
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppContext } from "@/context/AppContext";
import { ArrowUpRight, Book, FileText, MessageSquare, User, Wrench } from "lucide-react";
import { useState, useEffect } from "react";

const ActivityHeatmap = ({ activities }: { activities: any[] }) => {
  // 处理活动数据，创建日期-活跃度映射
  const activityMap = activities.reduce((acc: Record<string, number>, activity) => {
    const date = activity.activity_date;
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] = Math.max(acc[date], activity.activity_level);
    return acc;
  }, {});
  
  // 生成过去90天的日期
  const generateCalendarData = () => {
    const today = new Date();
    const daysToShow = 90;
    const calendarData = [];
    
    for (let i = daysToShow; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      calendarData.push({
        date: dateStr,
        level: activityMap[dateStr] || 0
      });
    }
    
    return calendarData;
  };

  const activityData = generateCalendarData();

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium">过去60天活跃度</div>
      <div className="flex flex-wrap gap-1">
        {activityData.map((day) => (
          <div
            key={day.date}
            title={`${day.date}: ${day.level} 项贡献`}
            className={`h-3 w-3 rounded-sm ${
              day.level === 0
                ? "bg-[#ebedf0]"
                : day.level === 1
                ? "bg-[#9be9a8]" 
                : day.level === 2
                ? "bg-[#40c463]"
                : day.level === 3
                ? "bg-[#30a14e]"
                : "bg-[#216e39]"
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
  const { 
    userProfile, 
    isProfileLoading, 
    activities, 
    fetchActivities,
    stats,
    fetchStats
  } = useAppContext();

  useEffect(() => {
    // 获取活动数据和统计数据
    fetchActivities();
    fetchStats();
    
    // 在组件挂载时记录一次仪表板访问活动
    const recordDashboardVisit = async () => {
      try {
        // 将仪表板访问作为一种活动记录，活跃度为1
        await recordActivity('dashboard', 1);
      } catch (error) {
        console.error('记录仪表板访问失败:', error);
      }
    };
    
    recordDashboardVisit();
  }, []);
  
  // 从AppContext获取recordActivity函数，但如果不存在则提供空函数
  const { recordActivity = async () => {} } = useAppContext();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "从未";
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "今天";
    if (diffDays === 1) return "昨天";
    if (diffDays < 7) return `${diffDays}天前`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`;
    return `${Math.floor(diffDays / 30)}个月前`;
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
              <ActivityHeatmap activities={activities} />
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
                <div className="text-2xl font-bold">{stats.reportCount}</div>
                <p className="text-xs text-muted-foreground">
                  上次更新: {formatDate(stats.lastReportDate)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">添加的论文</CardTitle>
                <Book className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.literatureCount}</div>
                <p className="text-xs text-muted-foreground">
                  上次更新: {formatDate(stats.lastLiteratureDate)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">活跃讨论</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.discussionCount}</div>
                <p className="text-xs text-muted-foreground">
                  上次更新: {formatDate(stats.lastDiscussionDate)}
                </p>
              </CardContent>
            </Card>
          </div>
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
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => recordActivity('report_view', 1)}
                  >
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
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => recordActivity('literature_view', 1)}
                  >
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
