
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpen, FileText, GraduationCap, Wrench, BarChart as BarChartIcon, BookOpen as BookIcon } from "lucide-react";
import BarChart from '@/components/charts/BarChart';

// Example activity data for the heatmap chart
const activityData = [
  { date: '2023-01', contributions: 5 },
  { date: '2023-02', contributions: 8 },
  { date: '2023-03', contributions: 12 },
  { date: '2023-04', contributions: 7 },
  { date: '2023-05', contributions: 15 },
  { date: '2023-06', contributions: 9 }
];

const Dashboard = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back to your research dashboard</p>
        </div>
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src="/placeholder.svg" alt="@username" />
            <AvatarFallback>UN</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">Dr. Jane Smith</p>
            <p className="text-sm text-muted-foreground">Senior Researcher</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Research Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+2 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Literature</CardTitle>
            <BookIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">145</div>
            <p className="text-xs text-muted-foreground">+12 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Research Outputs</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">36</div>
            <p className="text-xs text-muted-foreground">+3 this quarter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tools</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">+2 this month</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
            <CardDescription>Your contributions over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {/* Activity Chart placeholder */}
              <div className="h-full flex items-center justify-center border border-dashed rounded-lg bg-muted">
                Activity Chart Goes Here
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle>Recent Updates</CardTitle>
            <CardDescription>Latest activity across modules</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="rounded-full p-2 bg-blue-100 dark:bg-blue-900">
                <FileText className="h-4 w-4 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <p className="font-medium">Weekly Report Submitted</p>
                <p className="text-sm text-muted-foreground">You submitted your weekly progress report</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-full p-2 bg-green-100 dark:bg-green-900">
                <BookOpen className="h-4 w-4 text-green-600 dark:text-green-300" />
              </div>
              <div>
                <p className="font-medium">New Literature Added</p>
                <p className="text-sm text-muted-foreground">Added "Advances in Deep Learning" to your collection</p>
                <p className="text-xs text-muted-foreground">Yesterday</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-full p-2 bg-purple-100 dark:bg-purple-900">
                <GraduationCap className="h-4 w-4 text-purple-600 dark:text-purple-300" />
              </div>
              <div>
                <p className="font-medium">Research Output Published</p>
                <p className="text-sm text-muted-foreground">Your paper was published in IEEE Transactions</p>
                <p className="text-xs text-muted-foreground">3 days ago</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-full p-2 bg-amber-100 dark:bg-amber-900">
                <Wrench className="h-4 w-4 text-amber-600 dark:text-amber-300" />
              </div>
              <div>
                <p className="font-medium">Tool Updated</p>
                <p className="text-sm text-muted-foreground">Image Segmentation Tool v2.1 released</p>
                <p className="text-xs text-muted-foreground">1 week ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Subscriptions</CardTitle>
            <CardDescription>Content you're subscribed to</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="keywords">
              <TabsList className="mb-4">
                <TabsTrigger value="keywords">Keywords</TabsTrigger>
                <TabsTrigger value="authors">Authors</TabsTrigger>
                <TabsTrigger value="topics">Topics</TabsTrigger>
              </TabsList>
              <TabsContent value="keywords" className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    Deep Learning
                    <Button variant="ghost" size="icon" className="h-4 w-4 text-primary hover:text-destructive">✕</Button>
                  </div>
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    Computer Vision
                    <Button variant="ghost" size="icon" className="h-4 w-4 text-primary hover:text-destructive">✕</Button>
                  </div>
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    Natural Language Processing
                    <Button variant="ghost" size="icon" className="h-4 w-4 text-primary hover:text-destructive">✕</Button>
                  </div>
                </div>
                <Button variant="outline" size="sm">+ Add Keyword</Button>
              </TabsContent>
              <TabsContent value="authors" className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    Yoshua Bengio
                    <Button variant="ghost" size="icon" className="h-4 w-4 text-primary hover:text-destructive">✕</Button>
                  </div>
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    Geoffrey Hinton
                    <Button variant="ghost" size="icon" className="h-4 w-4 text-primary hover:text-destructive">✕</Button>
                  </div>
                </div>
                <Button variant="outline" size="sm">+ Add Author</Button>
              </TabsContent>
              <TabsContent value="topics" className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    Medical Imaging
                    <Button variant="ghost" size="icon" className="h-4 w-4 text-primary hover:text-destructive">✕</Button>
                  </div>
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    Robotics
                    <Button variant="ghost" size="icon" className="h-4 w-4 text-primary hover:text-destructive">✕</Button>
                  </div>
                </div>
                <Button variant="outline" size="sm">+ Add Topic</Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Update your details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center gap-2">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder.svg" alt="@username" />
                <AvatarFallback>JS</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm">Change Photo</Button>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold mb-1">Research Interests</h4>
              <div className="text-sm text-muted-foreground">
                Computer Vision, Machine Learning, Medical Imaging, Pattern Recognition
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold mb-1">Contact</h4>
              <div className="text-sm text-muted-foreground">
                jane.smith@research.edu<br />
                Office: Room 302, AI Building
              </div>
            </div>
            
            <Button>Edit Profile</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
