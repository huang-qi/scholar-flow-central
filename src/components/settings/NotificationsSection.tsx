
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function NotificationsSection() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState({
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

  const handleToggleNotification = (category: 'email' | 'push', type: string) => {
    setNotifications(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [type]: !prev[category][type as keyof typeof prev[category]]
      }
    }));
  };

  const handleSavePreferences = () => {
    toast({
      title: "Preferences saved",
      description: "Your notification preferences have been updated.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <Bell className="h-5 w-5" />
          <div>
            <CardTitle>Email Notifications</CardTitle>
            <CardDescription>
              Choose what emails you want to receive.
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
              Research updates and reports
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="emailSystemAnnouncements" 
              checked={notifications.email.systemAnnouncements}
              onCheckedChange={() => handleToggleNotification('email', 'systemAnnouncements')}
            />
            <Label htmlFor="emailSystemAnnouncements" className="cursor-pointer">
              System announcements
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="emailNewPublications" 
              checked={notifications.email.newPublications}
              onCheckedChange={() => handleToggleNotification('email', 'newPublications')}
            />
            <Label htmlFor="emailNewPublications" className="cursor-pointer">
              New publication alerts
            </Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Push Notifications</CardTitle>
          <CardDescription>
            Configure notifications sent to your browser or mobile app.
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
              Research updates and reports
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="pushSystemAnnouncements" 
              checked={notifications.push.systemAnnouncements}
              onCheckedChange={() => handleToggleNotification('push', 'systemAnnouncements')}
            />
            <Label htmlFor="pushSystemAnnouncements" className="cursor-pointer">
              System announcements
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="pushNewPublications" 
              checked={notifications.push.newPublications}
              onCheckedChange={() => handleToggleNotification('push', 'newPublications')}
            />
            <Label htmlFor="pushNewPublications" className="cursor-pointer">
              New publication alerts
            </Label>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleSavePreferences}>Save Preferences</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
