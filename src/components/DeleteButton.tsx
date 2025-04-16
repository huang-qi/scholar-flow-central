
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
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
import { Button } from './ui/button';

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
      
      // 检查这是否是数据库中存在的表
      const validTables = ["guidelines", "reports", "research_outputs", "tools"];
      
      if (validTables.includes(tableName)) {
        // 使用 Supabase 删除
        const { error } = await supabase
          .from(tableName as "guidelines" | "reports" | "research_outputs" | "tools")
          .delete()
          .eq('id', id);

        if (error) throw error;
      } else {
        // 对于数据库中尚不存在的表，我们将使用 localStorage 处理
        const localStorageKey = tableName;
        const storedItems = localStorage.getItem(localStorageKey);
        
        if (storedItems) {
          const items = JSON.parse(storedItems);
          const updatedItems = items.filter((item: any) => item.id !== id);
          localStorage.setItem(localStorageKey, JSON.stringify(updatedItems));
        }
        
        // 模拟网络请求
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      toast({
        title: '删除成功',
        description: `${itemName}已被删除。`,
      });

      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      console.error('删除错误:', error);
      toast({
        title: '删除失败',
        description: `删除${itemName}失败。请重试。`,
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
          aria-label={`删除${itemName}`}
          title={`删除${itemName}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>删除{itemName}</AlertDialogTitle>
          <AlertDialogDescription>
            您确定要删除{itemName}吗？此操作无法撤消。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete} 
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "删除中..." : "删除"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteButton;
