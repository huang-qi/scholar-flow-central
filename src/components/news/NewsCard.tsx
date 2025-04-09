
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, BookmarkCheck, Eye, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DeleteButton from "@/components/DeleteButton";

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  author: string;
  authorRole?: string;
  authorAvatar?: string;
  date: string;
  type: "announcement" | "update" | "event" | "achievement";
  important?: boolean;
  read?: boolean;
  saved?: boolean;
}

interface NewsCardProps {
  news: NewsItem;
  toggleSaved: (id: string) => void;
  onDelete?: () => void;
}

const getTypeColor = (type: string) => {
  switch(type) {
    case "announcement": return "bg-blue-500/10 text-blue-500";
    case "update": return "bg-emerald-500/10 text-emerald-500";
    case "event": return "bg-purple-500/10 text-purple-500";
    case "achievement": return "bg-amber-500/10 text-amber-500";
    default: return "bg-gray-500/10 text-gray-500";
  }
};

const NewsCard = ({ news, toggleSaved, onDelete }: NewsCardProps) => {
  const typeColor = getTypeColor(news.type);

  return (
    <Card className={`card-hover ${news.read ? 'bg-background' : 'bg-secondary/30'}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <div className="flex gap-2 items-center">
            <Badge className={typeColor + " capitalize"}>
              {news.type}
            </Badge>
            {news.important && (
              <Badge variant="destructive">Important</Badge>
            )}
          </div>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => toggleSaved(news.id)}
            >
              {news.saved ? (
                <BookmarkCheck className="h-5 w-5 text-primary" />
              ) : (
                <Bookmark className="h-5 w-5" />
              )}
            </Button>
            <DeleteButton 
              id={news.id} 
              itemName="News Item" 
              tableName="news" 
              onDelete={onDelete}
            />
          </div>
        </div>
        <CardTitle className="text-lg">{news.title}</CardTitle>
        <CardDescription className="flex items-center gap-2">
          <span>{new Date(news.date).toLocaleDateString()}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm">{news.content}</p>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={news.authorAvatar || "/placeholder.svg"} />
              <AvatarFallback>
                {news.author.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <span className="font-medium">{news.author}</span>
              {news.authorRole && (
                <span className="text-xs text-muted-foreground ml-1">
                  ({news.authorRole})
                </span>
              )}
            </div>
          </div>
          {!news.read && (
            <Button size="sm" variant="ghost">
              <Eye className="h-4 w-4 mr-1" />
              Mark as read
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsCard;
