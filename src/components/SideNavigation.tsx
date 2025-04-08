
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  BarChart2, Book, FileText, Inbox, 
  Info, LayoutDashboard, Settings, Wrench
} from "lucide-react";

interface SideNavigationProps {
  collapsed: boolean;
}

const navItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/",
  },
  {
    title: "Report Hub",
    icon: FileText,
    path: "/reports",
  },
  {
    title: "Literature",
    icon: Book,
    path: "/literature",
  },
  {
    title: "Research Outputs",
    icon: BarChart2,
    path: "/research",
  },
  {
    title: "AI Tool Library",
    icon: Wrench,
    path: "/tools",
  },
  {
    title: "Guidelines",
    icon: Info,
    path: "/guidelines",
  },
  {
    title: "News & Updates",
    icon: Inbox,
    path: "/news",
  },
];

export function SideNavigation({ collapsed }: SideNavigationProps) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-16 z-20 h-[calc(100vh-4rem)] border-r bg-sidebar transition-all duration-300 overflow-hidden",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <nav className="flex flex-col gap-2 p-4 text-sidebar-foreground h-full">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "nav-link",
                isActive ? "active bg-sidebar-accent text-sidebar-foreground" : "text-sidebar-foreground/80",
                collapsed ? "justify-center" : ""
              )
            }
          >
            <item.icon className={cn("h-5 w-5", collapsed ? "mr-0" : "mr-2")} />
            {!collapsed && <span>{item.title}</span>}
          </NavLink>
        ))}
        
        <div className="mt-auto">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              cn(
                "nav-link",
                isActive ? "active bg-sidebar-accent text-sidebar-foreground" : "text-sidebar-foreground/80",
                collapsed ? "justify-center" : ""
              )
            }
          >
            <Settings className={cn("h-5 w-5", collapsed ? "mr-0" : "mr-2")} />
            {!collapsed && <span>Settings</span>}
          </NavLink>
        </div>
      </nav>
    </aside>
  );
}
