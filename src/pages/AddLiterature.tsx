
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const AddLiterature = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    toast({
      title: "Success",
      description: "Literature item added successfully",
    });
    navigate("/literature");
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
              <Input id="title" placeholder="Enter title" required />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select>
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
                <Label htmlFor="date">Publication Date</Label>
                <Input id="date" type="date" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="authors">Authors</Label>
              <Input id="authors" placeholder="Authors (separated by commas)" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="source">Source/Journal/Publisher</Label>
              <Input id="source" placeholder="Publication source" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="abstract">Abstract</Label>
              <Textarea 
                id="abstract" 
                placeholder="Enter abstract or summary..." 
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords</Label>
              <Input id="keywords" placeholder="Separate keywords with commas" />
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
            <Button type="submit">
              Add Literature
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AddLiterature;
