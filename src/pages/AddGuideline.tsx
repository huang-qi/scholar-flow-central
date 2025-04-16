
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Checkbox } from "@/components/ui/checkbox";
import { v4 as uuidv4 } from 'uuid';

const AddGuideline = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
    version: "1.0",
    isMandatory: false,
    file: null as File | null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, file }));
  };
  
  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isMandatory: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.category || !formData.content) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create guideline object with all data
      const newGuideline = {
        id: uuidv4(),
        title: formData.title,
        category: formData.category,
        version: formData.version,
        description: formData.content,
        lastUpdated: new Date().toISOString(),
        fileName: formData.file ? formData.file.name : `${formData.title.toLowerCase().replace(/\s+/g, '_')}.pdf`
      };
      
      // First try to save to Supabase
      try {
        const { error } = await supabase.from('guidelines')
          .insert({
            title: formData.title,
            category: formData.category,
            content: formData.content,
            version: formData.version,
            is_mandatory: formData.isMandatory
          });
          
        if (error) {
          console.error("Error saving to Supabase:", error);
          throw error;
        }
      } catch (error) {
        console.error("Failed to save to database, saving to localStorage instead:", error);
        
        // Fall back to localStorage
        const existingGuidelines = JSON.parse(localStorage.getItem('guidelines') || '[]');
        existingGuidelines.push(newGuideline);
        localStorage.setItem('guidelines', JSON.stringify(existingGuidelines));
      }
      
      toast({
        title: "Success",
        description: "Guideline added successfully",
      });
      
      navigate("/guidelines");
    } catch (error) {
      console.error('Error adding guideline:', error);
      toast({
        title: "Error",
        description: "Failed to add guideline. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Add Guideline</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Guideline Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                name="title" 
                placeholder="Enter title" 
                value={formData.title}
                onChange={handleInputChange}
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Manuscript Submission">Manuscript Submission</SelectItem>
                  <SelectItem value="Code Management">Code Management</SelectItem>
                  <SelectItem value="Reporting">Reporting</SelectItem>
                  <SelectItem value="Data Management">Data Management</SelectItem>
                  <SelectItem value="Ethics">Ethics</SelectItem>
                  <SelectItem value="Collaboration">Collaboration</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="version">Version</Label>
              <Input 
                id="version" 
                name="version"
                value={formData.version} 
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea 
                id="content" 
                name="content"
                placeholder="Enter guideline content..." 
                rows={6}
                value={formData.content}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="mandatory" 
                checked={formData.isMandatory}
                onCheckedChange={handleCheckboxChange}
              />
              <Label htmlFor="mandatory" className="font-medium cursor-pointer">
                This guideline is mandatory
              </Label>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="file">Upload File (Optional)</Label>
              <Input 
                id="file" 
                type="file" 
                onChange={handleFileChange}
              />
              <p className="text-xs text-muted-foreground">
                Supported formats: PDF, DOCX, TXT (Max size: 5MB)
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => navigate("/guidelines")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Guideline"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AddGuideline;
