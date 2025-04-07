import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, Book, FileText, Wrench, User, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BarChart } from "@/components/charts/BarChart";

const ActivityHeatmap = () => {
  const generateActivityData = () => {
    const today = new Date();
    const daysToShow = 90; // ~3 months
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
      <div className="text-sm font-medium">Activity Contributions</div>
      <div className="flex flex-wrap gap-1">
        {activityData.map((day) => (
          <div
            key={day.date}
            title={`${day.date}: ${day.level} contributions`}
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
        <div>Less</div>
        <div>More</div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const contributionData = {
    categories: ["Reports", "Literature", "Research", "Tools", "Comments"],
    series: [
      {
        name: "Contributions",
        data: [12, 5, 8, 3, 20],
      },
    ],
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-xl">Welcome, Dr. Bennett</CardTitle>
              <CardDescription>
                Here's what's happening in your research group
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon">
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>DB</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">Dr. David Bennett</h3>
                <p className="text-sm text-muted-foreground">Associate Professor of AI Research</p>
                <div className="flex gap-2 mt-1">
                  <Badge variant="secondary">NLP</Badge>
                  <Badge variant="secondary">Computer Vision</Badge>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Your Contributions</h3>
              <ActivityHeatmap />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Recent Activity</CardTitle>
            <CardDescription>Latest updates from the team</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Marie uploaded a weekly report</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10">
                <Book className="h-4 w-4 text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium">Alex added 3 papers to the library</p>
                <p className="text-xs text-muted-foreground">Yesterday</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <Wrench className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">New AI tool added: "Image Segmentation API"</p>
                <p className="text-xs text-muted-foreground">3 days ago</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10">
                <User className="h-4 w-4 text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium">Robin joined the research group</p>
                <p className="text-xs text-muted-foreground">1 week ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Research Overview</TabsTrigger>
          <TabsTrigger value="reports">Recent Reports</TabsTrigger>
          <TabsTrigger value="literature">Literature Updates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Weekly Reports</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+2 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Papers Added</CardTitle>
                <Book className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">28</div>
                <p className="text-xs text-muted-foreground">+8 since last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Discussions</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7</div>
                <p className="text-xs text-muted-foreground">+1 new thread today</p>
              </CardContent>
            </Card>
          </div>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Research Output Breakdown</CardTitle>
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
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>
                The latest research reports from your team
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {["Weekly Progress on NLP Model", "Computer Vision Research Update", "Collaborative Research Results", "Model Performance Analysis"].map((report, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{report}</p>
                      <p className="text-xs text-muted-foreground">
                        {["Marie Chen", "Alex Jordan", "Team Collaboration", "Robin Taylor"][i]} • {["2 hours ago", "1 day ago", "2 days ago", "1 week ago"][i]}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="literature" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Literature Updates</CardTitle>
              <CardDescription>
                Recently added papers and research literature
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                "Advances in Transformer Architectures for Vision Tasks",
                "Survey of Reinforcement Learning in Robotic Applications",
                "Recent Progress in Self-supervised Learning",
                "Multi-modal Foundation Models: A Comprehensive Survey"
              ].map((paper, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10">
                      <Book className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{paper}</p>
                      <p className="text-xs text-muted-foreground">
                        Added by {["Alex", "Marie", "Robin", "David"][i]} • {i === 0 ? "Today" : ["3 days ago", "1 week ago", "2 weeks ago"][i-1]}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
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
