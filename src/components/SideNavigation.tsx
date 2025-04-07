
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  BookOpen, 
  GraduationCap, 
  Wrench, 
  FileCheck, 
  BellRing 
} from 'lucide-react';

const SideNavigation = () => {
  const navItems = [
    { title: 'Dashboard', path: '/', icon: <LayoutDashboard className="h-5 w-5" /> },
    { title: 'Report Hub', path: '/reports', icon: <FileText className="h-5 w-5" /> },
    { title: 'Literature', path: '/literature', icon: <BookOpen className="h-5 w-5" /> },
    { title: 'Research Output', path: '/research', icon: <GraduationCap className="h-5 w-5" /> },
    { title: 'Tool Library', path: '/tools', icon: <Wrench className="h-5 w-5" /> },
    { title: 'Guidelines', path: '/guidelines', icon: <FileCheck className="h-5 w-5" /> },
    { title: 'Notifications', path: '/notifications', icon: <BellRing className="h-5 w-5" /> },
  ];

  return (
    <div className="w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6">
        <h1 className="text-lg font-bold">Research Group</h1>
      </div>
      <nav className="flex-1">
        <ul className="space-y-1 px-3">
          {navItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground transition-colors"
              >
                {item.icon}
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-6 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-accent-foreground">
            JS
          </div>
          <div>
            <p className="text-sm font-medium">Dr. Jane Smith</p>
            <p className="text-xs text-muted-foreground">Senior Researcher</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideNavigation;
