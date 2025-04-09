
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, Upload, Filter, Calendar, Search
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
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ReportItem from "@/components/reports/ReportItem";
import { useAppContext } from "@/context/AppContext";

const reportTypes = ["Individual", "Internal Group", "Collaborative"];

const ReportHub = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userProfile } = useAppContext();

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('reports')
        .select('*');
      
      if (error) throw error;
      
      setReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast({
        title: "Error",
        description: "Failed to load reports. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [toast]);

  const handleReportDeleted = () => {
    fetchReports();
  };

  const filteredReports = reports.filter(report => {
    // Filter by search query
    const matchesSearch = !searchQuery || 
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (report.keywords && report.keywords.some((k: string) => k.toLowerCase().includes(searchQuery.toLowerCase())));
    
    // Filter by type
    const matchesType = !selectedType || report.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Report Hub</h1>
        <Button onClick={() => navigate("/add-report")}>
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
            {isLoading ? (
              <div className="grid grid-cols-1 gap-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader className="space-y-2">
                      <div className="h-4 w-2/3 bg-gray-200 rounded" />
                      <div className="h-3 w-1/2 bg-gray-200 rounded" />
                    </CardHeader>
                    <CardContent className="h-12" />
                  </Card>
                ))}
              </div>
            ) : filteredReports.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {filteredReports.map(report => (
                  <ReportItem 
                    key={report.id} 
                    report={report}
                    onReportDeleted={handleReportDeleted} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No reports found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="my">
            <div className="grid grid-cols-1 gap-4">
              {!isLoading && reports
                .filter(report => report.author === userProfile.name)
                .map(report => (
                  <ReportItem 
                    key={report.id} 
                    report={report}
                    onReportDeleted={handleReportDeleted} 
                  />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="recent">
            <div className="grid grid-cols-1 gap-4">
              {!isLoading && reports.slice(0, 2).map(report => (
                <ReportItem 
                  key={report.id} 
                  report={report}
                  onReportDeleted={handleReportDeleted} 
                />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="saved">
            <div className="grid grid-cols-1 gap-4">
              {!isLoading && reports.length > 0 && (
                <ReportItem 
                  report={reports[0]}
                  onReportDeleted={handleReportDeleted} 
                />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ReportHub;
