
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
import { useAppContext } from "@/context/AppContext";

const AddReport = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { userProfile } = useAppContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    type: "",
    dueDate: "",
    description: "",
    contributors: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, type: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!formData.title || !formData.type) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Parse the contributors from comma-separated string to an array
      const keywords = formData.contributors
        .split(',')
        .map(keyword => keyword.trim())
        .filter(keyword => keyword.length > 0);
      
      // Insert the report into Supabase
      const { data, error } = await supabase
        .from('reports')
        .insert({
          title: formData.title,
          type: formData.type,
          content: formData.description,
          author: userProfile.name,
          keywords: keywords,
          date: formData.dueDate || new Date().toISOString(),
        });
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Report added successfully",
      });
      
      navigate("/reports");
    } catch (error) {
      console.error("Error adding report:", error);
      toast({
        title: "Error",
        description: "Failed to add report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Add New Report</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Report Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Report Title</Label>
              <Input 
                id="title" 
                placeholder="Enter report title" 
                required 
                value={formData.title}
                onChange={handleChange}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Report Type</Label>
                <Select onValueChange={handleSelectChange} value={formData.type}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="progress">Progress Report</SelectItem>
                    <SelectItem value="final">Final Report</SelectItem>
                    <SelectItem value="summary">Summary Report</SelectItem>
                    <SelectItem value="analysis">Analysis Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input 
                  id="dueDate" 
                  type="date" 
                  value={formData.dueDate}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder="Describe the report contents and scope..." 
                rows={5}
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contributors">Contributors</Label>
              <Input 
                id="contributors" 
                placeholder="Add contributors (separated by commas)" 
                value={formData.contributors}
                onChange={handleChange}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => navigate("/reports")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Report"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AddReport;
