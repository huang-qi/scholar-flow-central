
import DeleteButton from "@/components/DeleteButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Eye } from "lucide-react";

export interface GuidelineDocument {
  id: string;
  title: string;
  category: string;
  version: string;
  lastUpdated: string;
  description: string;
  fileName: string;
}

interface GuidelineItemProps {
  guideline: GuidelineDocument;
  onDelete?: () => void;
}

const GuidelineItem = ({ guideline, onDelete }: GuidelineItemProps) => {
  return (
    <Card className="card-hover">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{guideline.title}</CardTitle>
          <Badge variant="outline">版本 {guideline.version}</Badge>
        </div>
        <CardDescription>
          更新时间：{new Date(guideline.lastUpdated).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground mb-2">
          {guideline.description}
        </p>
        <div className="text-xs text-muted-foreground">
          文件：{guideline.fileName}
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Download className="h-4 w-4 mr-1" />
            下载
          </Button>
          <Button size="sm">
            <Eye className="h-4 w-4 mr-1" />
            查看
          </Button>
          <DeleteButton 
            id={guideline.id} 
            itemName="指南" 
            tableName="guidelines"
            onDelete={onDelete}
          />
        </div>
      </CardFooter>
    </Card>
  );
};

export default GuidelineItem;
