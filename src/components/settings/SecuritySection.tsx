
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function SecuritySection() {
  const { toast } = useToast();
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = () => {
    // Validation would go here
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "请填写所有密码字段。",
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "新密码不匹配。",
      });
      return;
    }

    // In a real app, this would update the password
    toast({
      title: "密码已更新",
      description: "您的密码已成功更改。",
    });
    
    // Reset fields
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleTwoFactorToggle = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    
    toast({
      title: `双因素认证已${!twoFactorEnabled ? '启用' : '禁用'}`,
      description: `您账户的双因素认证已${!twoFactorEnabled ? '启用' : '禁用'}。`,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <Key className="h-5 w-5" />
          <div>
            <CardTitle>更改密码</CardTitle>
            <CardDescription>
              更新您的密码以保持账户安全。
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">当前密码</Label>
            <Input 
              id="currentPassword" 
              name="currentPassword"
              type="password" 
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">新密码</Label>
            <Input 
              id="newPassword" 
              name="newPassword"
              type="password" 
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">确认新密码</Label>
            <Input 
              id="confirmPassword" 
              name="confirmPassword"
              type="password" 
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleChangePassword}>更新密码</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <Shield className="h-5 w-5" />
          <div>
            <CardTitle>双因素认证</CardTitle>
            <CardDescription>
              为您的账户添加额外的安全层。
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="twoFactor" 
              checked={twoFactorEnabled} 
              onCheckedChange={handleTwoFactorToggle} 
            />
            <Label htmlFor="twoFactor" className="cursor-pointer">
              启用双因素认证
            </Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
