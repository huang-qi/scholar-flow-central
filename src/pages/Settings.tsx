
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSection } from "@/components/settings/ProfileSection";
import { SecuritySection } from "@/components/settings/SecuritySection";
import { NotificationsSection } from "@/components/settings/NotificationsSection";
import { Card } from "@/components/ui/card";

const Settings = () => {
  const [activeTab, setActiveTab] = useState<string>("profile");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">设置</h1>
        <p className="text-muted-foreground">
          管理您的账户设置和偏好。
        </p>
      </div>

      <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full sm:w-[400px]">
          <TabsTrigger value="profile">个人资料</TabsTrigger>
          <TabsTrigger value="security">安全</TabsTrigger>
          <TabsTrigger value="notifications">通知</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="profile">
            <ProfileSection />
          </TabsContent>
          
          <TabsContent value="security">
            <SecuritySection />
          </TabsContent>
          
          <TabsContent value="notifications">
            <NotificationsSection />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Settings;
