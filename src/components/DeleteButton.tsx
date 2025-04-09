
import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface DeleteButtonProps {
  id: string;
  itemName: string;
  tableName: string;
  onDelete?: () => void;
}

const DeleteButton = ({ id, itemName, tableName, onDelete }: DeleteButtonProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      
      // Check if this is a table that exists in our database
      const validTables = ["guidelines", "reports", "research_outputs", "tools"];
      
      if (validTables.includes(tableName)) {
        // Use Supabase to delete
        const { error } = await supabase
          .from(tableName as "guidelines" | "reports" | "research_outputs" | "tools")
          .delete()
          .eq('id', id);

        if (error) throw error;
      } else {
        // For tables that don't exist yet in the database, we'll handle with localStorage
        const localStorageKey = tableName;
        const storedItems = localStorage.getItem(localStorageKey);
        
        if (storedItems) {
          const items = JSON.parse(storedItems);
          const updatedItems = items.filter((item: any) => item.id !== id);
          localStorage.setItem(localStorageKey, JSON.stringify(updatedItems));
        }
        
        // Simulate network request
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      toast({
        title: 'Deleted successfully',
        description: `The ${itemName.toLowerCase()} has been deleted.`,
      });

      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      console.error('Error deleting:', error);
      toast({
        title: 'Delete failed',
        description: `Failed to delete ${itemName.toLowerCase()}. Please try again.`,
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive-icon"
          size="icon"
          aria-label={`Delete ${itemName}`}
          title={`Delete ${itemName}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {itemName}</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this {itemName.toLowerCase()}? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete} 
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteButton;
