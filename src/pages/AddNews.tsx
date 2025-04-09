
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppContext } from "@/context/AppContext";
import { v4 as uuidv4 } from 'uuid';

const AddNews = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { userProfile } = useAppContext();
  
  const [newsData, setNewsData] = useState({
    title: "",
    content: "",
    type: "" as "announcement" | "update" | "event" | "achievement",
    important: false,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewsData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setNewsData(prev => ({ ...prev, type: value as "announcement" | "update" | "event" | "achievement" }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setNewsData(prev => ({ ...prev, important: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newsData.title.trim() || !newsData.content.trim() || !newsData.type) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create the news item
      const newNewsItem = {
        id: uuidv4(),
        title: newsData.title,
        content: newsData.content,
        author: userProfile.name,
        authorRole: userProfile.title,
        authorAvatar: userProfile.avatar,
        date: new Date().toISOString(),
        type: newsData.type,
        important: newsData.important,
        read: false,
        saved: false
      };
      
      // Store in localStorage
      const existingNews = JSON.parse(localStorage.getItem('news') || '[]');
      existingNews.unshift(newNewsItem); // Add to beginning of array
      localStorage.setItem('news', JSON.stringify(existingNews));
      
      toast({
        title: "Success",
        description: "News item added successfully",
      });
      navigate("/news");
    } catch (error) {
      console.error("Error adding news:", error);
      toast({
        title: "Failed to add news",
        description: "An error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Add News & Update</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Create News Item</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                name="title" 
                placeholder="Enter title" 
                value={newsData.title}
                onChange={handleInputChange}
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                name="content"
                placeholder="Enter news content..."
                rows={6}
                value={newsData.content}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select 
                  value={newsData.type} 
                  onValueChange={handleSelectChange} 
                  required
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="announcement">Announcement</SelectItem>
                    <SelectItem value="update">Update</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="achievement">Achievement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2 h-full">
                <Checkbox 
                  id="important" 
                  checked={newsData.important}
                  onCheckedChange={handleCheckboxChange}
                />
                <Label htmlFor="important" className="font-medium cursor-pointer">
                  Mark as Important
                </Label>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => navigate("/news")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add News"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AddNews;
