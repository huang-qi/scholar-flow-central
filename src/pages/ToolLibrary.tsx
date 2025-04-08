
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ToolCard } from "@/components/tools/ToolCard";
import { ToolsEmptyState } from "@/components/tools/ToolsEmptyState";
import { ToolsFilters } from "@/components/tools/ToolsFilters";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTools } from "@/hooks/useTools";

const ToolLibrary = () => {
  const navigate = useNavigate();
  const { 
    filteredTools, 
    toolTypes, 
    searchQuery, 
    setSearchQuery, 
    selectedType, 
    setSelectedType,
    isLoading,
    error
  } = useTools();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Tool Library</h1>
        <Button onClick={() => navigate("/add-tool")}>
          <Plus className="mr-1 h-4 w-4" />
          Add Tool
        </Button>
      </div>

      <ToolsFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        toolTypes={toolTypes}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-4 w-2/3 bg-gray-200 rounded" />
                <div className="h-3 w-1/2 bg-gray-200 rounded" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-12 bg-gray-200 rounded" />
                <div className="flex flex-wrap gap-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-6 w-12 bg-gray-200 rounded-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading Tools</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : filteredTools.length === 0 ? (
        <ToolsEmptyState 
          selectedType={selectedType}
          searchQuery={searchQuery}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ToolLibrary;
