
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Code, Award, ExternalLink, Download, Eye } from "lucide-react";
import DeleteButton from "@/components/DeleteButton";

type OutputType = "paper" | "code" | "patent";

interface ResearchOutput {
  id: string;
  title: string;
  type: OutputType;
  authors: string[];
  year: number;
  venue?: string;
  link?: string;
  tags: string[];
  citations?: number;
}

interface OutputCardProps {
  output: ResearchOutput;
  onDelete?: () => void;
}

const OutputTypeIcon = ({ type }: { type: OutputType }) => {
  switch (type) {
    case "paper":
      return <FileText className="h-5 w-5" />;
    case "code":
      return <Code className="h-5 w-5" />;
    case "patent":
      return <Award className="h-5 w-5" />;
  }
};

const OutputCard = ({ output, onDelete }: OutputCardProps) => {
  return (
    <Card className="card-hover">
      <CardHeader className="pb-2">
        <div className="flex items-start gap-3">
          <div className={`flex h-9 w-9 items-center justify-center rounded-full ${
            output.type === "paper" ? "bg-primary/10" : 
            output.type === "code" ? "bg-accent/10" : 
            "bg-amber-500/10"
          }`}>
            <OutputTypeIcon type={output.type} />
          </div>
          <div>
            <CardTitle className="text-lg">{output.title}</CardTitle>
            <CardDescription>
              {output.authors.slice(0, 3).join(", ")}
              {output.authors.length > 3 ? ", et al." : ""} • {output.year}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex flex-wrap gap-2 mb-2">
          {output.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        {output.venue && (
          <div className="text-sm text-muted-foreground">
            {output.venue}
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-between pt-2">
        {output.citations !== undefined && (
          <div className="text-sm text-muted-foreground">
            Citations: {output.citations}
          </div>
        )}
        <div className="flex gap-2">
          {output.type === "code" && output.link && (
            <Button size="sm" variant="outline">
              <ExternalLink className="h-4 w-4 mr-1" />
              Repository
            </Button>
          )}
          {output.type === "paper" && (
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4 mr-1" />
              PDF
            </Button>
          )}
          <Button size="sm">
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <DeleteButton 
            id={output.id} 
            itemName={output.type === "paper" ? "Paper" : output.type === "code" ? "Code" : "Patent"} 
            tableName="research_outputs"
            onDelete={onDelete}
          />
        </div>
      </CardFooter>
    </Card>
  );
};

export default OutputCard;
