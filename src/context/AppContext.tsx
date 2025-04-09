
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  name: string;
  email: string;
  title: string;
  department: string;
  bio: string;
  avatar: string;
  tags: string[];
}

interface AppContextType {
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string>;
  isProfileLoading: boolean;
}

// Default profile values
const defaultProfile: UserProfile = {
  name: "Guest User",
  email: "",
  title: "Researcher",
  department: "Research",
  bio: "",
  avatar: "/placeholder.svg",
  tags: ["NLP", "Computer Vision"]
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultProfile);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Load profile data from localStorage initially for quick rendering
    const storedProfile = localStorage.getItem('userProfile');
    if (storedProfile) {
      try {
        setUserProfile({
          ...defaultProfile,
          ...JSON.parse(storedProfile)
        });
      } catch (e) {
        console.error("Failed to parse stored profile", e);
      }
    }
    
    // No longer try to load from the database since profiles table doesn't exist
    setIsProfileLoading(false);
  }, []);

  const updateUserProfile = async (profileUpdate: Partial<UserProfile>) => {
    try {
      // Update local state immediately for a responsive UI
      const updatedProfile = { ...userProfile, ...profileUpdate };
      setUserProfile(updatedProfile);
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
      return Promise.reject(error);
    }
  };

  const uploadAvatar = async (file: File): Promise<string> => {
    try {
      // For improved user experience, create a proper file URL instead of a blob URL
      // that gets lost on page refresh
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target && event.target.result) {
            // Store the base64 string
            const base64String = event.target.result.toString();
            
            // Update the profile with the new avatar URL
            updateUserProfile({ avatar: base64String })
              .then(() => resolve(base64String))
              .catch(reject);
          } else {
            reject(new Error('Failed to read file'));
          }
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });
    } catch (error) {
      console.error('Avatar upload failed:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload avatar. Please try again.",
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
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
