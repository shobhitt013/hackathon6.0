import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { UserProgress } from "@/entities/UserProgress";
import { LearningModule } from "@/entities/LearningModule";
import { EmergencyAlert } from "@/entities/EmergencyAlert";
import { DrillSession } from "@/entities/DrillSession";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Shield,
  BookOpen,
  AlertTriangle,
  Trophy,
  TrendingUp,
  Clock,
  Users,
  Target,
  Award,
  Bell,
  Calendar,
  Activity
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    completedModules: 0,
    totalModules: 0,
    totalPoints: 0,
    badges: 0,
    recentProgress: []
  });
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [upcomingDrills, setUpcomingDrills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const userData = await User.me();
      setUser(userData);

      // Load user progress
      const userProgress = await UserProgress.filter({ 
        user_id: userData.id,
        completion_status: "completed" 
      });

      // Load total available modules
      const allModules = await LearningModule.filter({ 
        target_age_group: [userData.grade_level, "all"] 
      });

      // Load active alerts
      const alerts = await EmergencyAlert.filter({ 
        is_active: true,
        target_regions: userData.region 
      }, '-created_date', 5);

      // Load upcoming drills
      const drills = await DrillSession.filter({
        school_name: userData.school_name,
        status: "scheduled"
      }, 'scheduled_date', 3);

      setStats({
        completedModules: userProgress.length,
        totalModules: allModules.length,
        totalPoints: userData.total_points || 0,
        badges: userData.badges_earned?.length || 0,
        recentProgress: userProgress.slice(0, 5)
      });

      setActiveAlerts(alerts);
      setUpcomingDrills(drills);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
    setIsLoading(false);
  };

  const getWelcomeMessage = () => {
    if (!user) return "";
    
    const hour = new Date().getHours();
    const timeGreeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
    const name = user.full_name?.split(' ')[0] || 'there';
    
    return `${timeGreeting}, ${name}!`;
  };

  const getCompletionPercentage = () => {
    if (stats.totalModules === 0) return 0;
    return Math.round((stats.completedModules / stats.totalModules) * 100);
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {getWelcomeMessage()}
            </h1>
            <p className="text-gray-600 mt-2">
              Stay prepared, stay safe. Let's continue your safety journey.
            </p>
          </div>
          <div className="flex gap-3">
            <Link to={createPageUrl("Learning")}>
              <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                <BookOpen className="w-4 h-4 mr-2" />
                Continue Learning
              </Button>
            </Link>
          </div>
        </div>

        {/* Active Alerts */}
        {activeAlerts.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-orange-500" />
              Active Alerts
            </h2>
            {activeAlerts.map((alert) => (
              <Alert key={alert.id} className={`border-l-4 ${
                alert.severity === 'critical' ? 'border-red-500 bg-red-50' :
                alert.severity === 'high' ? 'border-orange-500 bg-orange-50' :
                'border-yellow-500 bg-yellow-50'
              }`}>
                <AlertTriangle className={`h-4 w-4 ${
                  alert.severity === 'critical' ? 'text-red-600' :
                  alert.severity === 'high' ? 'text-orange-600' :
                  'text-yellow-600'
                }`} />
                <AlertDescription>
                  <div className="font-semibold">{alert.title}</div>
                  <div className="text-sm mt-1">{alert.message}</div>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">
                Learning Progress
              </CardTitle>
              <BookOpen className="h-5 w-5 text-blue-200" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{getCompletionPercentage()}%</div>
              <p className="text-xs text-blue-100 mt-1">
                {stats.completedModules} of {stats.totalModules} modules completed
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-emerald-100">
                Points Earned
              </CardTitle>
              <Trophy className="h-5 w-5 text-emerald-200" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalPoints}</div>
              <p className="text-xs text-emerald-100 mt-1">
                Keep learning to earn more!
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">
                Badges Earned
              </CardTitle>
              <Award className="h-5 w-5 text-purple-200" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.badges}</div>
              <p className="text-xs text-purple-100 mt-1">
                Achievement unlocked!
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-orange-100">
                Safety Level
              </CardTitle>
              <Shield className="h-5 w-5 text-orange-200" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {getCompletionPercentage() > 75 ? 'Expert' :
                 getCompletionPercentage() > 50 ? 'Advanced' :
                 getCompletionPercentage() > 25 ? 'Intermediate' : 'Beginner'}
              </div>
              <p className="text-xs text-orange-100 mt-1">
                Based on your progress
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upcoming Drills */}
          <Card className="lg:col-span-2 shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Calendar className="w-5 h-5 text-blue-500" />
                Upcoming Drills
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingDrills.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>No upcoming drills scheduled</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingDrills.map((drill) => (
                    <div key={drill.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Shield className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{drill.title}</h3>
                          <p className="text-sm text-gray-500">
                            {new Date(drill.scheduled_date).toLocaleDateString()} at{' '}
                            {new Date(drill.scheduled_date).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-700">
                        {drill.drill_type.replace('_', ' ')}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-gray-900">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to={createPageUrl("Emergency")} className="block">
                <Button variant="outline" className="w-full justify-start h-12 border-red-200 hover:bg-red-50">
                  <AlertTriangle className="w-5 h-5 mr-3 text-red-500" />
                  Emergency Toolkit
                </Button>
              </Link>
              
              <Link to={createPageUrl("Learning")} className="block">
                <Button variant="outline" className="w-full justify-start h-12 border-blue-200 hover:bg-blue-50">
                  <BookOpen className="w-5 h-5 mr-3 text-blue-500" />
                  Start Learning
                </Button>
              </Link>
              
              <Link to={createPageUrl("Progress")} className="block">
                <Button variant="outline" className="w-full justify-start h-12 border-green-200 hover:bg-green-50">
                  <Trophy className="w-5 h-5 mr-3 text-green-500" />
                  View Progress
                </Button>
              </Link>

              <Link to={createPageUrl("Drills")} className="block">
                <Button variant="outline" className="w-full justify-start h-12 border-purple-200 hover:bg-purple-50">
                  <Target className="w-5 h-5 mr-3 text-purple-500" />
                  Practice Drills
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}