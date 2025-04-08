
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAppContext } from "@/context/AppContext";

const AddTool = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { userProfile } = useAppContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
    tags: "",
    hasDocumentation: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, type: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, hasDocumentation: checked }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!formData.name || !formData.type || !formData.description) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Parse tags from comma-separated string to an array
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      
      // Insert the tool into Supabase
      const { data, error } = await supabase
        .from('tools')
        .insert({
          name: formData.name,
          description: formData.description,
          type: formData.type,
          tags: tags,
          author: userProfile.name,
          has_documentation: formData.hasDocumentation,
        });
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Tool added successfully",
      });
      
      navigate("/tools");
    } catch (error) {
      console.error("Error adding tool:", error);
      toast({
        title: "Error",
        description: "Failed to add tool. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Add New Tool</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Tool Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tool Name</Label>
              <Input 
                id="name" 
                placeholder="Enter tool name" 
                required 
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Tool Type</Label>
              <Select onValueChange={handleSelectChange} value={formData.type}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="api">API</SelectItem>
                  <SelectItem value="library">Library</SelectItem>
                  <SelectItem value="framework">Framework</SelectItem>
                  <SelectItem value="utility">Utility</SelectItem>
                  <SelectItem value="dataset">Dataset</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder="Describe what this tool does..." 
                rows={4}
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input 
                id="tags" 
                placeholder="Add tags separated by commas (e.g., AI, ML, NLP)" 
                value={formData.tags}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch 
                id="hasDocumentation" 
                checked={formData.hasDocumentation}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="hasDocumentation">Has documentation</Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => navigate("/tools")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Tool"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AddTool;
