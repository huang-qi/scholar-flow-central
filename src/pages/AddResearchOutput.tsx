
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AddResearchOutput = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    outputType: "paper",
    status: "published",
    date: new Date().toISOString().split('T')[0],
    authors: "",
    description: "",
    link: "",
    venue: "",
    tags: ""
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Format date as year
      const year = new Date(formData.date).getFullYear();
      
      // Format the data for Supabase
      const { data, error } = await supabase
        .from('research_outputs')
        .insert({
          title: formData.title,
          type: formData.outputType,
          authors: formData.authors.split(',').map(a => a.trim()),
          year: year,
          venue: formData.venue || null,
          link: formData.link || null,
          tags: formData.tags.split(',').filter(t => t.trim()).map(t => t.trim()),
          citations: 0
        })
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Research output added successfully",
      });
      navigate("/research");
    } catch (error) {
      console.error('Error adding research output:', error);
      toast({
        title: "Error",
        description: "Failed to add research output. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Add Research Output</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Output Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                placeholder="Enter title" 
                required 
                value={formData.title}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-4">
              <Label>Output Type</Label>
              <RadioGroup 
                defaultValue="paper" 
                className="grid grid-cols-3 gap-4" 
                value={formData.outputType}
                onValueChange={(value) => handleSelectChange("outputType", value)}
              >
                <Label htmlFor="paper" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                  <RadioGroupItem value="paper" id="paper" className="sr-only" />
                  <span>Academic Paper</span>
                </Label>
                <Label htmlFor="code" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                  <RadioGroupItem value="code" id="code" className="sr-only" />
                  <span>Code Repository</span>
                </Label>
                <Label htmlFor="patent" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                  <RadioGroupItem value="patent" id="patent" className="sr-only" />
                  <span>Patent</span>
                </Label>
              </RadioGroup>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="review">Under Review</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input 
                  id="date" 
                  type="date" 
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="authors">Authors/Contributors</Label>
              <Input 
                id="authors" 
                placeholder="Names separated by commas" 
                required
                value={formData.authors}
                onChange={handleChange}
              />
            </div>
            
            {formData.outputType === 'paper' && (
              <div className="space-y-2">
                <Label htmlFor="venue">Journal/Conference</Label>
                <Input 
                  id="venue" 
                  placeholder="Where was this published" 
                  value={formData.venue}
                  onChange={handleChange}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="description">Description/Abstract</Label>
              <Textarea 
                id="description" 
                placeholder="Describe the research output..." 
                rows={4}
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="link">External Link</Label>
              <Input 
                id="link" 
                placeholder="URL to paper, code repository, or patent" 
                value={formData.link}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags">Keywords/Tags</Label>
              <Input 
                id="tags" 
                placeholder="Separate tags with commas (e.g., NLP, Machine Learning)" 
                value={formData.tags}
                onChange={handleChange}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => navigate("/research")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Research Output"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AddResearchOutput;
