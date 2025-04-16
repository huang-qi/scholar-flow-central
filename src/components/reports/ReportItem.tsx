
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, MessageSquare, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DeleteButton from "@/components/DeleteButton";

export interface ReportItemProps {
  report: {
    id: string;
    title: string;
    author: string;
    date: string;
    type: string;
    keywords?: string[];
    views?: number;
    comments?: number;
  };
  onReportDeleted?: () => void;
}

const ReportItem = ({ report, onReportDeleted }: ReportItemProps) => {
  const navigate = useNavigate();
  
  return (
    <Card className="card-hover">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{report.title}</CardTitle>
          <Badge variant={
            report.type === "Individual" ? "outline" : 
            report.type === "Internal Group" ? "secondary" : "default"
          }>{report.type === "Individual" ? "个人" : 
              report.type === "Internal Group" ? "内部团队" : report.type}</Badge>
        </div>
        <CardDescription className="flex items-center gap-2">
          <span>{report.author}</span>
          <span>•</span>
          <span>{new Date(report.date).toLocaleDateString()}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex flex-wrap gap-2 mb-3">
          {report.keywords && report.keywords.map((keyword: string) => (
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
            <span>{report.views || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>{report.comments || 0}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost">
            <Download className="h-4 w-4 mr-1" />
            下载
          </Button>
          <Button size="sm">
            <Eye className="h-4 w-4 mr-1" />
            查看
          </Button>
          <DeleteButton 
            id={report.id} 
            itemName="报告" 
            tableName="reports"
            onDelete={onReportDeleted}
          />
        </div>
      </CardFooter>
    </Card>
  );
};

export default ReportItem;
