
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

interface UserActivity {
  id: string;
  activity_type: string;
  activity_level: number;
  activity_date: string;
  reference_id?: string;
}

interface UserStats {
  reportCount: number;
  literatureCount: number;
  discussionCount: number;
  lastReportDate?: string;
  lastLiteratureDate?: string;
  lastDiscussionDate?: string;
}

interface AppContextType {
  userProfile: UserProfile; // 用户资料
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>; // 更新用户资料
  uploadAvatar: (file: File) => Promise<string>; // 上传头像
  isProfileLoading: boolean; // 资料加载状态
  activities: UserActivity[]; // 用户活动数据
  fetchActivities: () => Promise<void>; // 获取活动数据
  recordActivity: (type: string, level: number, referenceId?: string) => Promise<void>; // 记录新活动
  stats: UserStats; // 用户统计数据
  fetchStats: () => Promise<void>; // 获取统计数据
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

const defaultStats: UserStats = {
  reportCount: 0,
  literatureCount: 0,
  discussionCount: 0
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultProfile);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [stats, setStats] = useState<UserStats>(defaultStats);
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
    
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // 尝试从数据库获取用户资料
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error && error.code !== 'PGRST116') {
          console.error("获取资料失败", error);
        } else if (data) {
          // 转换从数据库获取的资料到应用内部使用的格式
          const profileData: UserProfile = {
            name: data.full_name || defaultProfile.name,
            email: user.email || "",
            title: data.title || defaultProfile.title,
            department: data.department || defaultProfile.department,
            bio: data.bio || "",
            avatar: data.avatar_url || defaultProfile.avatar,
            tags: data.tags || defaultProfile.tags
          };
          
          setUserProfile(profileData);
          localStorage.setItem('userProfile', JSON.stringify(profileData));
        }
        
        // 获取活动数据
        fetchActivities();
        
        // 获取统计数据
        fetchStats();
      }
    } catch (error) {
      console.error("加载资料时出错:", error);
    } finally {
      setIsProfileLoading(false);
    }
  };

  const updateUserProfile = async (profileUpdate: Partial<UserProfile>) => {
    try {
      // 立即更新本地状态以提供响应式UI体验
      const updatedProfile = { ...userProfile, ...profileUpdate };
      setUserProfile(updatedProfile);
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      
      // 获取当前用户ID
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // 更新数据库中的资料
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: updatedProfile.name,
            title: updatedProfile.title,
            department: updatedProfile.department,
            bio: updatedProfile.bio,
            tags: updatedProfile.tags,
            avatar_url: updatedProfile.avatar,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);
          
        if (error) {
          console.error('数据库更新失败:', error);
          throw error;
        }
      }
      
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

  const fetchActivities = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;
      
      // 获取最近90天的活动数据
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 90);
      
      const { data, error } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', user.id)
        .gte('activity_date', startDate.toISOString().split('T')[0])
        .order('activity_date', { ascending: false });
        
      if (error) {
        console.error("获取活动数据失败", error);
        return;
      }
      
      if (data) {
        const formattedActivities = data.map(item => ({
          id: item.id,
          activity_type: item.activity_type,
          activity_level: item.activity_level,
          activity_date: item.activity_date,
          reference_id: item.reference_id
        }));
        
        setActivities(formattedActivities);
      }
    } catch (error) {
      console.error("获取活动数据时出错:", error);
    }
  };

  const recordActivity = async (type: string, level: number, referenceId?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;
      
      // 记录新活动
      const today = new Date().toISOString().split('T')[0];
      
      const { error } = await supabase
        .from('user_activities')
        .insert({
          user_id: user.id,
          activity_type: type,
          activity_level: level,
          activity_date: today,
          reference_id: referenceId
        });
        
      if (error) {
        console.error("记录活动失败", error);
        return;
      }
      
      // 更新本地活动列表
      fetchActivities();
      
      // 更新统计数据
      updateStats(type);
    } catch (error) {
      console.error("记录活动时出错:", error);
    }
  };

  const updateStats = async (activityType: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;
      
      // 获取当前统计数据
      const { data, error } = await supabase
        .from('user_research_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        console.error("获取统计数据失败", error);
        return;
      }
      
      const now = new Date().toISOString();
      let updateData: any = {};
      
      // 根据活动类型更新相应的计数和日期
      if (activityType === 'report') {
        updateData = {
          report_count: (data?.report_count || 0) + 1,
          last_report_date: now
        };
      } else if (activityType === 'literature') {
        updateData = {
          literature_count: (data?.literature_count || 0) + 1,
          last_literature_date: now
        };
      } else if (activityType === 'discussion') {
        updateData = {
          discussion_count: (data?.discussion_count || 0) + 1,
          last_discussion_date: now
        };
      }
      
      // 如果存在记录则更新，否则插入新记录
      if (data) {
        await supabase
          .from('user_research_stats')
          .update({
            ...updateData,
            updated_at: now
          })
          .eq('id', data.id);
      } else {
        await supabase
          .from('user_research_stats')
          .insert({
            user_id: user.id,
            ...updateData,
            updated_at: now
          });
      }
      
      // 更新本地统计数据
      fetchStats();
    } catch (error) {
      console.error("更新统计数据时出错:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;
      
      const { data, error } = await supabase
        .from('user_research_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        console.error("获取统计数据失败", error);
        return;
      }
      
      if (data) {
        setStats({
          reportCount: data.report_count || 0,
          literatureCount: data.literature_count || 0,
          discussionCount: data.discussion_count || 0,
          lastReportDate: data.last_report_date,
          lastLiteratureDate: data.last_literature_date,
          lastDiscussionDate: data.last_discussion_date
        });
      }
    } catch (error) {
      console.error("获取统计数据时出错:", error);
    }
  };

  return (
    <AppContext.Provider value={{ 
      userProfile, 
      updateUserProfile,
      uploadAvatar,
      isProfileLoading,
      activities,
      fetchActivities,
      recordActivity,
      stats,
      fetchStats
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
