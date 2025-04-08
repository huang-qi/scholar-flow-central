
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tool } from "@/types/tool";
import { HeartIcon, Play, Star, Eye } from "lucide-react";

interface ToolCardProps {
  tool: Tool;
}

const ToolCard = ({ tool }: ToolCardProps) => {
  return (
    <Card className="card-hover">
      <CardHeader>
        <div className="flex justify-between">
          <div>
            <CardTitle className="text-lg">{tool.name}</CardTitle>
            <CardDescription className="text-sm">{tool.type} by {tool.author}</CardDescription>
          </div>
          <Badge variant="outline">{tool.views} views</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed mb-4">{tool.description}</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {tool.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>Last updated: {new Date(tool.lastUpdated).toLocaleDateString()}</div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-amber-500" />
            <span>{tool.stars}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-between pt-0">
        <div className="flex items-center text-sm">
          {tool.hasDocumentation && (
            <div className="flex items-center gap-1 text-primary">
              <Eye className="h-4 w-4" />
              <span>Documentation</span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <HeartIcon className="h-4 w-4 mr-1" />
            Favorite
          </Button>
          <Button size="sm">
            <Play className="h-4 w-4 mr-1" />
            Try It
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ToolCard;
