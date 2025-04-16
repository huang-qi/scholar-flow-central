import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  name: string; // 姓名
  email: string; // 邮箱
  title: string; // 职位
  department: string; // 部门
  bio: string; // 个人简介
  avatar: string; // 头像
  tags: string[]; // 标签
}

interface AppContextType {
  userProfile: UserProfile; // 用户资料
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>; // 更新用户资料
  uploadAvatar: (file: File) => Promise<string>; // 上传头像
  isProfileLoading: boolean; // 资料加载状态
}

// 默认资料值
const defaultProfile: UserProfile = {
  name: "访客用户",
  email: "",
  title: "研究员",
  department: "研究部",
  bio: "",
  avatar: "/placeholder.svg",
  tags: ["自然语言处理", "计算机视觉"]
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultProfile);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // 首先从localStorage加载资料数据以快速渲染
    const storedProfile = localStorage.getItem('userProfile');
    if (storedProfile) {
      try {
        setUserProfile({
          ...defaultProfile,
          ...JSON.parse(storedProfile)
        });
      } catch (e) {
        console.error("解析存储的资料失败", e);
      }
    }
    
    // 由于profiles表不存在，不再尝试从数据库加载
    setIsProfileLoading(false);
  }, []);

  const updateUserProfile = async (profileUpdate: Partial<UserProfile>) => {
    try {
      // 立即更新本地状态以提供响应式UI体验
      const updatedProfile = { ...userProfile, ...profileUpdate };
      setUserProfile(updatedProfile);
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      
      toast({
        title: "资料已更新",
        description: "您的个人资料已成功更新",
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error('更新资料时出错:', error);
      toast({
        title: "更新失败",
        description: "资料更新失败。请重试。",
        variant: "destructive",
      });
      return Promise.reject(error);
    }
  };

  const uploadAvatar = async (file: File): Promise<string> => {
    try {
      // 为了改善用户体验，创建一个proper文件URL而不是blob URL
      // 避免页面刷新后丢失
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target && event.target.result) {
            // 存储base64字符串
            const base64String = event.target.result.toString();
            
            // 使用新的头像URL更新资料
            updateUserProfile({ avatar: base64String })
              .then(() => resolve(base64String))
              .catch(reject);
          } else {
            reject(new Error('读取文件失败'));
          }
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });
    } catch (error) {
      console.error('头像上传失败:', error);
      toast({
        title: "上传失败",
        description: "头像上传失败。请重试。",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <AppContext.Provider value={{ 
      userProfile, 
      updateUserProfile,
      uploadAvatar,
      isProfileLoading
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext必须在AppProvider内部使用');
  }
  return context;
};
