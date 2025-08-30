import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import { 
  Shield, 
  BookOpen, 
  AlertTriangle, 
  Trophy, 
  Settings, 
  Bell,
  Menu,
  X,
  Home,
  Users,
  BarChart3
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await User.me();
        setUser(userData);
      } catch (error) {
        console.error("User not logged in:", error);
      }
      setIsLoading(false);
    };
    loadUser();
  }, []);

  const getNavigationItems = () => {
    if (!user) return [];

    const commonItems = [
      { title: "Dashboard", url: createPageUrl("Dashboard"), icon: Home },
      { title: "Learning Modules", url: createPageUrl("Learning"), icon: BookOpen },
      { title: "Emergency Alerts", url: createPageUrl("Alerts"), icon: AlertTriangle },
      { title: "Drills", url: createPageUrl("Drills"), icon: Shield },
    ];

    if (user.user_type === "student") {
      return [
        ...commonItems,
        { title: "My Progress", url: createPageUrl("Progress"), icon: Trophy },
        { title: "Emergency Toolkit", url: createPageUrl("Emergency"), icon: AlertTriangle },
      ];
    }

    if (user.user_type === "teacher") {
      return [
        ...commonItems,
        { title: "Student Progress", url: createPageUrl("StudentProgress"), icon: BarChart3 },
        { title: "Emergency Toolkit", url: createPageUrl("Emergency"), icon: AlertTriangle },
      ];
    }

    if (user.user_type === "administrator") {
      return [
        ...commonItems,
        { title: "User Management", url: createPageUrl("UserManagement"), icon: Users },
        { title: "Analytics", url: createPageUrl("Analytics"), icon: BarChart3 },
        { title: "Send Alerts", url: createPageUrl("SendAlert"), icon: Bell },
      ];
    }

    return commonItems;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            SafeLearn
          </h1>
          <p className="text-gray-600 mb-8">
            Your comprehensive disaster preparedness education platform
          </p>
          <Button 
            onClick={() => User.login()} 
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
          >
            Sign In to Continue
          </Button>
        </div>
      </div>
    );
  }

  const navigationItems = getNavigationItems();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <Sidebar className="border-r border-gray-200 bg-white">
          <SidebarHeader className="border-b border-gray-100 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-lg">SafeLearn</h2>
                <p className="text-xs text-gray-500">Disaster Preparedness</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 rounded-xl ${
                          location.pathname === item.url ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-700'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-6">
              <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                Quick Stats
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-4 py-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Points</span>
                    <Badge className="bg-green-100 text-green-700">
                      {user.total_points || 0}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Badges</span>
                    <Badge className="bg-purple-100 text-purple-700">
                      {user.badges_earned?.length || 0}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {user.user_type} • {user.grade_level}
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {user.full_name?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">
                  {user.full_name || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.school_name || 'SafeLearn User'}
                </p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white border-b border-gray-200 px-6 py-4 lg:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-semibold text-gray-900">SafeLearn</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}