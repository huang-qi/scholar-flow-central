
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { SideNavigation } from "./SideNavigation";
import { TopBar } from "./TopBar";
import { cn } from "@/lib/utils";

const Layout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar sidebarCollapsed={sidebarCollapsed} onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
      
      <div className="flex flex-1 overflow-hidden">
        <SideNavigation collapsed={sidebarCollapsed} />
        
        <main className={cn(
          "flex-1 overflow-y-auto p-6 transition-all duration-300",
          sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
        )}>
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
