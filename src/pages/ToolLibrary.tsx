
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Wrench } from "lucide-react";
import ToolCard from "@/components/tools/ToolCard";
import { useTools } from "@/hooks/useTools";
import ToolsEmptyState from "@/components/tools/ToolsEmptyState";
import ToolsFilters from "@/components/tools/ToolsFilters";

const ToolLibrary = () => {
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

  const renderToolsList = (tools = filteredTools) => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="border rounded-md p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-4 w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded mb-6 w-1/2"></div>
              <div className="h-16 bg-gray-200 rounded mb-4"></div>
              <div className="flex gap-2 mb-4">
                <div className="h-6 bg-gray-200 rounded w-20"></div>
                <div className="h-6 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="flex justify-end">
                <div className="h-8 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="text-center py-12">
          <p className="text-red-500 font-medium">Error loading tools: {error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      );
    }
    
    if (tools.length === 0) {
      return <ToolsEmptyState />;
    }

    return (
      <div className="grid grid-cols-1 gap-4">
        {tools.map(tool => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">AI Tool Library</h1>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Add Tool
        </Button>
      </div>

      <div className="space-y-6">
        <ToolsFilters 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          toolTypes={toolTypes}
        />

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Tools</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="recent">Recently Used</TabsTrigger>
            <TabsTrigger value="my">My Tools</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-4">
            {renderToolsList()}
          </TabsContent>
          <TabsContent value="favorites" className="space-y-4">
            {renderToolsList(filteredTools.slice(1, 3))}
          </TabsContent>
          <TabsContent value="recent" className="space-y-4">
            {renderToolsList(filteredTools.slice(0, 2))}
          </TabsContent>
          <TabsContent value="my" className="space-y-4">
            {renderToolsList(filteredTools.filter(tool => tool.author === "David Bennett"))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ToolLibrary;
