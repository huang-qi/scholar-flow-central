import DeleteButton from "@/components/DeleteButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Bookmark, BookmarkCheck, ExternalLink, FileEdit, Star } from "lucide-react";

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  doi?: string;
  tags: string[];
  rating: number;
  notes: boolean;
  saved?: boolean; // 添加此属性
}

interface PublicationCardProps {
  publication: Publication;
  onDelete: (id: string) => void;
  onToggleSaved?: (id: string) => void;
}

const PublicationCard = ({ publication, onDelete, onToggleSaved }: PublicationCardProps) => {
  const { id, title, authors, journal, year, doi, tags, rating, notes } = publication;
  
  return (
    <Card className="card-hover">
      <CardHeader className="pb-3">
        <div className="flex justify-between">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>
              {authors.join("、")} • {year}
            </CardDescription>
          </div>
          <div className="flex gap-1">
            {onToggleSaved && (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onToggleSaved(id)}
                title={publication.saved ? "取消收藏" : "收藏"}
              >
                {publication.saved ? (
                  <BookmarkCheck className="h-5 w-5 text-primary" />
                ) : (
                  <Bookmark className="h-5 w-5" />
                )}
              </Button>
            )}
            <DeleteButton 
              id={id} 
              itemName="文献" 
              tableName="literature" 
              onDelete={() => onDelete(id)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex flex-wrap gap-1 mb-2">
          {tags.map(tag => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          {journal}
          {doi && <span className="ml-2">• DOI: {doi}</span>}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center">
          {Array(5).fill(0).map((_, i) => (
            <Star 
              key={i} 
              className={`h-4 w-4 ${i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          {notes && (
            <Button size="sm" variant="outline">
              <FileEdit className="h-4 w-4 mr-1" />
              笔记
            </Button>
          )}
          <Button size="sm">
            <ExternalLink className="h-4 w-4 mr-1" />
            查看
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PublicationCard;
