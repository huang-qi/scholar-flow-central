
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAppContext } from "@/context/AppContext";

const Profile = () => {
  const { userProfile, isProfileLoading } = useAppContext();

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
            <h3 className="font-medium mb-2">联系方式</h3>
            <p className="text-sm">{userProfile.email || "暂无电子邮箱。"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
