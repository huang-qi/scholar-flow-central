
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Download, ExternalLink, Star } from "lucide-react";
import DeleteButton from "@/components/DeleteButton";

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  journal?: string;
  year: number;
  doi?: string;
  tags: string[];
  rating?: number;
  notes: boolean;
}

interface PublicationCardProps {
  publication: Publication;
  onDelete?: () => void;
}

const PublicationCard = ({ publication, onDelete }: PublicationCardProps) => {
  return (
    <Card className="card-hover">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg leading-tight">{publication.title}</CardTitle>
        <CardDescription>
          {publication.authors.slice(0, 3).join(", ")}
          {publication.authors.length > 3 ? ", et al." : ""}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex flex-wrap gap-2 mb-3">
          {publication.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            {publication.journal && `${publication.journal}, `}
            <span>{publication.year}</span>
          </div>
          <div className="flex items-center">
            {publication.rating && Array(publication.rating).fill(0).map((_, i) => (
              <Star key={i} className="h-4 w-4 text-amber-500" />
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-between pt-2">
        <div className="flex items-center text-sm">
          {publication.notes && (
            <div className="flex items-center gap-1 text-teal-600">
              <BookOpen className="h-4 w-4" />
              <span>Notes</span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Download className="h-4 w-4 mr-1" />
            PDF
          </Button>
          {publication.doi && (
            <Button size="sm" variant="outline">
              <ExternalLink className="h-4 w-4 mr-1" />
              DOI
            </Button>
          )}
          <Button size="sm">
            <BookOpen className="h-4 w-4 mr-1" />
            Read
          </Button>
          <DeleteButton 
            id={publication.id} 
            itemName="Publication" 
            tableName="literature" 
            onDelete={onDelete}
          />
        </div>
      </CardFooter>
    </Card>
  );
};

export default PublicationCard;
