
import { useState, useEffect } from "react";
import { Tool } from "@/types/tool";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useTools() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    async function fetchTools() {
      try {
        setIsLoading(true);
        setError(null);
        
        // Explicitly specifying the generic parameter to fix TypeScript errors
        const { data, error } = await supabase
          .from('tools')
          .select('*');
          
        if (error) {
          throw new Error(error.message);
        }
        
        // Convert from Supabase format to our Tool format with proper type checking
        const formattedTools: Tool[] = data.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description,
          type: item.type,
          tags: item.tags,
          author: item.author,
          lastUpdated: item.last_updated || new Date().toISOString(),
          stars: item.stars,
          views: item.views,
          hasDocumentation: item.has_documentation
        }));
        
        setTools(formattedTools);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch tools";
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchTools();
  }, [toast]);
  
  const toolTypes = Array.from(new Set(tools.map(tool => tool.type))).sort();
  
  const filteredTools = tools.filter(tool => {
    const matchesSearch = !searchQuery || 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = !selectedType || tool.type === selectedType;
    
    return matchesSearch && matchesType;
  });
  
  return {
    tools,
    filteredTools,
    toolTypes,
    searchQuery,
    setSearchQuery,
    selectedType,
    setSelectedType,
    isLoading,
    error
  };
}
