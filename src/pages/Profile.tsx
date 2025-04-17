
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAppContext } from "@/context/AppContext";

// 定义每月活动日历组件
const ActivityCalendar = ({ activities }: { activities: any[] }) => {
  // 处理活动数据，创建日期-活跃度映射
  const activityMap = activities.reduce((acc: Record<string, number>, activity) => {
    const date = activity.activity_date;
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] = Math.max(acc[date], activity.activity_level);
    return acc;
  }, {});
  
  // 生成过去60天的日期
  const generateCalendarData = () => {
    const today = new Date();
    const daysToShow = 60;
    const calendarData = [];
    
    for (let i = daysToShow; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      calendarData.push({
        date: dateStr,
        level: activityMap[dateStr] || 0
      });
    }
    
    return calendarData;
  };

  const calendarData = generateCalendarData();

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium">过去60天活跃度</div>
      <div className="flex flex-wrap gap-1">
        {calendarData.map((day) => (
          <div
            key={day.date}
            title={`${day.date}: ${day.level} 活跃度`}
            className={`h-3 w-3 rounded-sm ${
              day.level === 0
                ? "bg-[#ebedf0]"
                : day.level === 1
                ? "bg-[#9be9a8]" 
                : day.level === 2
                ? "bg-[#40c463]"
                : day.level === 3
                ? "bg-[#30a14e]"
                : "bg-[#216e39]"
            }`}
          />
        ))}
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <div>较少</div>
        <div>较多</div>
      </div>
    </div>
  );
};

const Profile = () => {
  const { userProfile, isProfileLoading, activities, fetchActivities } = useAppContext();

  useEffect(() => {
    fetchActivities();
  }, []);

  if (isProfileLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-100 animate-pulse rounded" />
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <div className="h-32 w-32 rounded-full bg-gray-100 animate-pulse" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">我的个人资料</h1>
        <p className="text-muted-foreground">
          查看您的个人资料信息。
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={userProfile.avatar} />
            <AvatarFallback>{userProfile.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{userProfile.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{userProfile.title}</p>
            <p className="text-sm text-muted-foreground">{userProfile.department}</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">个人简介</h3>
            <p className="text-sm">
              {userProfile.bio || "暂无个人简介。"}
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-2">研究兴趣与技能</h3>
            <div className="flex flex-wrap gap-2">
              {userProfile.tags.length > 0 ? (
                userProfile.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">尚未添加标签。</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">活动记录</h3>
            <ActivityCalendar activities={activities} />
          </div>

          <div>
            <h3 className="font-medium mb-2">联系方式</h3>
            <p className="text-sm">{userProfile.email || "暂无电子邮箱。"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
