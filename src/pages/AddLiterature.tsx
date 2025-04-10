import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AddLiterature = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    type: "article",
    authors: "",
    journal: "",
    year: new Date().getFullYear(),
    doi: "",
    abstract: "",
    keywords: "",
    rating: 0
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
      // Format the data for Supabase
      const { data, error } = await supabase
        .from('literature')
        .insert({
          title: formData.title,
          authors: formData.authors.split(',').map(a => a.trim()),
          journal: formData.journal,
          year: parseInt(formData.year.toString()),
          doi: formData.doi || null,
          tags: formData.keywords.split(',').map(k => k.trim()),
          rating: 0,
          notes: false
        } as any) // Use type assertion to bypass TypeScript check
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Literature item added successfully",
      });
      navigate("/literature");
    } catch (error) {
      console.error('Error adding literature:', error);
      toast({
        title: "Error",
        description: "Failed to add literature. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Add Literature</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Literature Details</CardTitle>
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
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => handleSelectChange("type", value)}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="article">Journal Article</SelectItem>
                    <SelectItem value="book">Book</SelectItem>
                    <SelectItem value="conference">Conference Paper</SelectItem>
                    <SelectItem value="thesis">Thesis</SelectItem>
                    <SelectItem value="report">Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="year">Publication Year</Label>
                <Input 
                  id="year" 
                  type="number" 
                  value={formData.year}
                  onChange={handleChange}
                  min={1900}
                  max={new Date().getFullYear() + 1}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="authors">Authors</Label>
              <Input 
                id="authors" 
                placeholder="Authors (separated by commas)" 
                required 
                value={formData.authors}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="journal">Source/Journal/Publisher</Label>
              <Input 
                id="journal" 
                placeholder="Publication source" 
                value={formData.journal}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="abstract">Abstract</Label>
              <Textarea 
                id="abstract" 
                placeholder="Enter abstract or summary..." 
                rows={4}
                value={formData.abstract}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords</Label>
              <Input 
                id="keywords" 
                placeholder="Separate keywords with commas" 
                value={formData.keywords}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="doi">DOI (Digital Object Identifier)</Label>
              <Input 
                id="doi" 
                placeholder="e.g., 10.1000/xyz123" 
                value={formData.doi}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">Upload PDF (optional)</Label>
              <Input id="file" type="file" accept=".pdf" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => navigate("/literature")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Literature"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AddLiterature;
