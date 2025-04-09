
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
        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-muted-foreground">
          View your personal profile information.
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
            <h3 className="font-medium mb-2">Biography</h3>
            <p className="text-sm">
              {userProfile.bio || "No biography provided."}
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-2">Research Interests & Skills</h3>
            <div className="flex flex-wrap gap-2">
              {userProfile.tags.length > 0 ? (
                userProfile.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No tags added yet.</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Contact</h3>
            <p className="text-sm">{userProfile.email || "No email provided."}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
