
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, Upload, Filter, Calendar, Search, 
  Download, MessageSquare, Eye
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const reportTypes = ["Individual", "Internal Group", "Collaborative"];
const sampleReports = [
  {
    id: 1,
    title: "Weekly Progress on NLP Model Training",
    author: "Marie Chen",
    type: "Individual",
    date: "2025-04-01",
    keywords: ["NLP", "Transformer", "Training"],
    views: 8,
    comments: 2
  },
  {
    id: 2,
    title: "Computer Vision Object Detection Update",
    author: "Alex Jordan",
    type: "Individual",
    date: "2025-03-28",
    keywords: ["CV", "Object Detection", "YOLOv8"],
    views: 12,
    comments: 5
  },
  {
    id: 3,
    title: "Collaborative Research on Multimodal Learning",
    author: "Research Team",
    type: "Collaborative",
    date: "2025-03-24",
    keywords: ["Multimodal", "Collaboration", "Vision-Language"],
    views: 24,
    comments: 8
  },
  {
    id: 4,
    title: "Monthly Progress Report: AI Ethics Committee",
    author: "Ethics Working Group",
    type: "Internal Group",
    date: "2025-03-15",
    keywords: ["Ethics", "Governance", "Fairness"],
    views: 18,
    comments: 10
  },
  {
    id: 5,
    title: "Weekly Update on Reinforcement Learning Project",
    author: "David Bennett",
    type: "Individual",
    date: "2025-03-12",
    keywords: ["RL", "Policy Gradient", "Simulation"],
    views: 6,
    comments: 1
  }
];

const ReportItem = ({ report }: { report: typeof sampleReports[0] }) => (
  <Card className="card-hover">
    <CardHeader className="pb-3">
      <div className="flex justify-between items-start">
        <CardTitle className="text-lg">{report.title}</CardTitle>
        <Badge variant={
          report.type === "Individual" ? "outline" : 
          report.type === "Internal Group" ? "secondary" : "default"
        }>{report.type}</Badge>
      </div>
      <CardDescription className="flex items-center gap-2">
        <span>{report.author}</span>
        <span>•</span>
        <span>{new Date(report.date).toLocaleDateString()}</span>
      </CardDescription>
    </CardHeader>
    <CardContent className="pb-2">
      <div className="flex flex-wrap gap-2 mb-3">
        {report.keywords.map(keyword => (
          <Badge key={keyword} variant="secondary" className="text-xs">
            {keyword}
          </Badge>
        ))}
      </div>
    </CardContent>
    <CardFooter className="flex justify-between pt-0">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Eye className="h-4 w-4" />
          <span>{report.views}</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageSquare className="h-4 w-4" />
          <span>{report.comments}</span>
        </div>
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant="ghost">
          <Download className="h-4 w-4 mr-1" />
          Download
        </Button>
        <Button size="sm">
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
      </div>
    </CardFooter>
  </Card>
);

const ReportHub = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const filteredReports = sampleReports.filter(report => {
    // Filter by search query
    const matchesSearch = !searchQuery || 
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Filter by type
    const matchesType = !selectedType || report.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Report Hub</h1>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Upload Report
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search reports..." 
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
                  <SelectValue placeholder="Filter by type" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {reportTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Date
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by date</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>This week</DropdownMenuItem>
                <DropdownMenuItem>This month</DropdownMenuItem>
                <DropdownMenuItem>Last 3 months</DropdownMenuItem>
                <DropdownMenuItem>Custom range</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Reports</TabsTrigger>
            <TabsTrigger value="my">My Reports</TabsTrigger>
            <TabsTrigger value="recent">Recently Viewed</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {filteredReports.length > 0 ? (
                filteredReports.map(report => (
                  <ReportItem key={report.id} report={report} />
                ))
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No reports found</h3>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="my">
            <div className="grid grid-cols-1 gap-4">
              {sampleReports
                .filter(report => report.author === "David Bennett")
                .map(report => (
                  <ReportItem key={report.id} report={report} />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="recent">
            <div className="grid grid-cols-1 gap-4">
              {/* Just showing a couple of sample items for recently viewed */}
              {sampleReports.slice(0, 2).map(report => (
                <ReportItem key={report.id} report={report} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="saved">
            <div className="grid grid-cols-1 gap-4">
              {/* Just showing a saved item */}
              <ReportItem report={sampleReports[2]} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ReportHub;
