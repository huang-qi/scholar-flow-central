
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const AddGuideline = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    toast({
      title: "Success",
      description: "Guideline added successfully",
    });
    navigate("/guidelines");
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
              <Input id="title" placeholder="Enter guideline title" required />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="research">Research Methodology</SelectItem>
                    <SelectItem value="publication">Publication Standards</SelectItem>
                    <SelectItem value="ethics">Ethical Guidelines</SelectItem>
                    <SelectItem value="data">Data Management</SelectItem>
                    <SelectItem value="collaboration">Collaboration Protocol</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="version">Version</Label>
                <Input id="version" placeholder="e.g., 1.0" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea 
                id="content" 
                placeholder="Write guideline content here..." 
                rows={10}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="required" />
              <Label htmlFor="required">Mark as mandatory</Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => navigate("/guidelines")}>
              Cancel
            </Button>
            <Button type="submit">
              Add Guideline
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AddGuideline;
