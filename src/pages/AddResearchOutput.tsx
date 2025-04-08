
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const AddResearchOutput = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    toast({
      title: "Success",
      description: "Research output added successfully",
    });
    navigate("/research");
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
              <Input id="title" placeholder="Enter title" required />
            </div>
            
            <div className="space-y-4">
              <Label>Output Type</Label>
              <RadioGroup defaultValue="paper" className="grid grid-cols-3 gap-4">
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
                <Select>
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
                <Input id="date" type="date" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="authors">Authors/Contributors</Label>
              <Input id="authors" placeholder="Names separated by commas" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description/Abstract</Label>
              <Textarea 
                id="description" 
                placeholder="Describe the research output..." 
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="link">External Link</Label>
              <Input id="link" placeholder="URL to paper, code repository, or patent" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => navigate("/research")}>
              Cancel
            </Button>
            <Button type="submit">
              Add Research Output
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AddResearchOutput;
