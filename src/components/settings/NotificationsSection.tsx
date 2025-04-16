
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// 定义通知类型
type NotificationType = 'researchUpdates' | 'systemAnnouncements' | 'newPublications';
type NotificationCategory = 'email' | 'push';

interface NotificationsState {
  email: Record<NotificationType, boolean>;
  push: Record<NotificationType, boolean>;
}

export function NotificationsSection() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<NotificationsState>({
    email: {
      researchUpdates: true,
      systemAnnouncements: true,
      newPublications: true,
    },
    push: {
      researchUpdates: false,
      systemAnnouncements: true,
      newPublications: false,
    }
  });

  const handleToggleNotification = (category: NotificationCategory, type: NotificationType) => {
    setNotifications(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [type]: !prev[category][type]
      }
    }));
  };

  const handleSavePreferences = () => {
    toast({
      title: "设置已保存",
      description: "您的通知偏好设置已更新。",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <Bell className="h-5 w-5" />
          <div>
            <CardTitle>邮件通知</CardTitle>
            <CardDescription>
              选择您想要接收的邮件。
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="emailResearchUpdates" 
              checked={notifications.email.researchUpdates}
              onCheckedChange={() => handleToggleNotification('email', 'researchUpdates')}
            />
            <Label htmlFor="emailResearchUpdates" className="cursor-pointer">
              研究更新和报告
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="emailSystemAnnouncements" 
              checked={notifications.email.systemAnnouncements}
              onCheckedChange={() => handleToggleNotification('email', 'systemAnnouncements')}
            />
            <Label htmlFor="emailSystemAnnouncements" className="cursor-pointer">
              系统公告
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="emailNewPublications" 
              checked={notifications.email.newPublications}
              onCheckedChange={() => handleToggleNotification('email', 'newPublications')}
            />
            <Label htmlFor="emailNewPublications" className="cursor-pointer">
              新发布提醒
            </Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>推送通知</CardTitle>
          <CardDescription>
            配置发送到您的浏览器或移动应用的通知。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="pushResearchUpdates" 
              checked={notifications.push.researchUpdates}
              onCheckedChange={() => handleToggleNotification('push', 'researchUpdates')}
            />
            <Label htmlFor="pushResearchUpdates" className="cursor-pointer">
              研究更新和报告
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="pushSystemAnnouncements" 
              checked={notifications.push.systemAnnouncements}
              onCheckedChange={() => handleToggleNotification('push', 'systemAnnouncements')}
            />
            <Label htmlFor="pushSystemAnnouncements" className="cursor-pointer">
              系统公告
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="pushNewPublications" 
              checked={notifications.push.newPublications}
              onCheckedChange={() => handleToggleNotification('push', 'newPublications')}
            />
            <Label htmlFor="pushNewPublications" className="cursor-pointer">
              新发布提醒
            </Label>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleSavePreferences}>保存设置</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
