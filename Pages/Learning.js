
import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { LearningModule } from "@/entities/LearningModule";
import { UserProgress } from "@/entities/UserProgress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom"; // Assuming react-router-dom is used for navigation

import {
  BookOpen,
  Clock,
  Trophy,
  CheckCircle,
  PlayCircle,
  Flame,
  Zap,
  Waves,
  Wind,
  Shield,
  HeartHandshake, // Updated icon for first_aid
  PhoneOutgoing, // Updated icon for communication
} from "lucide-react";

const disasterIcons = {
  fire: Flame,
  earthquake: Zap,
  flood: Waves,
  cyclone: Wind,
  general: Shield,
  first_aid: HeartHandshake, // Changed to HeartHandshake
  communication: PhoneOutgoing, // Changed to PhoneOutgoing
};

const disasterColors = {
  fire: "bg-red-100 text-red-700 border-red-200",
  earthquake: "bg-yellow-100 text-yellow-700 border-yellow-200",
  flood: "bg-blue-100 text-blue-700 border-blue-200",
  cyclone: "bg-gray-100 text-gray-700 border-gray-200",
  general: "bg-green-100 text-green-700 border-green-200",
  first_aid: "bg-pink-100 text-pink-700 border-pink-200",
  communication: "bg-purple-100 text-purple-700 border-purple-200"
};

// Helper function to create module detail page URLs
// Adjust this function based on your actual routing setup
const createPageUrl = (path) => {
  // Example: Assuming a route like '/modules/ModuleDetail?id=...'
  // or '/module/:id' where :id is module.id
  // For this outline, it's `ModuleDetail?id=${module.id}`
  return `/modules/${path}`;
};

export default function Learning() {
  const [user, setUser] = useState(null);
  const [modules, setModules] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLearningData();
  }, []);

  const loadLearningData = async () => {
    try {
      const userData = await User.me();
      setUser(userData);

      // Load modules appropriate for user's grade level, newest first
      const availableModules = await LearningModule.filter({
        target_age_group: [userData.grade_level, "all"],
        is_active: true
      }, '-created_date');

      // Load user's progress
      const progress = await UserProgress.filter({
        user_id: userData.id
      });

      setModules(availableModules);
      setUserProgress(progress);
    } catch (error) {
      console.error("Error loading learning data:", error);
    }
    setIsLoading(false);
  };

  const getModuleProgress = (moduleId) => {
    return userProgress.find(p => p.module_id === moduleId);
  };

  const getFilteredModules = () => {
    if (activeTab === "all") return modules;
    return modules.filter(module => module.disaster_type === activeTab);
  };

  const getModuleAction = (module) => {
    const progress = getModuleProgress(module.id);
    const link = createPageUrl(`ModuleDetail?id=${module.id}`); // Constructing the link using the helper

    if (progress?.completion_status === "completed") {
      return (
        <Link to={link}>
          <Button variant="outline" className="w-full">
            Review Module
          </Button>
        </Link>
      );
    }
    
    if (progress?.completion_status === "in_progress") {
      return (
        <Link to={link}>
          <Button className="w-full bg-blue-500 hover:bg-blue-600">
            <PlayCircle className="w-4 h-4 mr-2" />
            Continue
          </Button>
        </Link>
      );
    }

    return (
      <Link to={link}>
        <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
          <PlayCircle className="w-4 h-4 mr-2" />
          Start Learning
        </Button>
      </Link>
    );
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Learning Modules
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Master disaster preparedness through interactive lessons designed for your age group.
            Complete modules to earn points and unlock achievements!
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-6 h-6" />
              Your Learning Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {userProgress.filter(p => p.completion_status === "completed").length}
                </div>
                <div className="text-sm text-blue-100">Modules Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {user?.total_points || 0}
                </div>
                <div className="text-sm text-blue-100">Points Earned</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {Math.round((userProgress.filter(p => p.completion_status === "completed").length / modules.length) * 100) || 0}%
                </div>
                <div className="text-sm text-blue-100">Overall Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filter Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-4 md:grid-cols-8 bg-white shadow-sm">
            <TabsTrigger value="all" className="data-[state=active]:bg-blue-50">All</TabsTrigger>
            <TabsTrigger value="general" className="data-[state=active]:bg-green-50">Intro</TabsTrigger>
            <TabsTrigger value="earthquake" className="data-[state=active]:bg-yellow-50">Earthquake</TabsTrigger>
            <TabsTrigger value="fire" className="data-[state=active]:bg-red-50">Fire</TabsTrigger>
            <TabsTrigger value="flood" className="data-[state=active]:bg-blue-50">Flood</TabsTrigger>
            <TabsTrigger value="cyclone" className="data-[state=active]:bg-gray-50">Cyclone</TabsTrigger>
            <TabsTrigger value="first_aid" className="data-[state=active]:bg-pink-50">First Aid</TabsTrigger>
            <TabsTrigger value="communication" className="data-[state=active]:bg-purple-50">SOS</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFilteredModules().map((module) => {
                const progress = getModuleProgress(module.id);
                const Icon = disasterIcons[module.disaster_type] || Shield;
                
                return (
                  <Card key={module.id} className="hover:shadow-lg transition-all duration-300 border-0 shadow-md flex flex-col">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-xl ${disasterColors[module.disaster_type]?.replace('text-', 'bg-').split(' ')[0]}`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div>
                            <CardTitle className="text-lg line-clamp-2">
                              {module.title}
                            </CardTitle>
                          </div>
                        </div>
                        {progress?.completion_status === "completed" && (
                          <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-3">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {module.duration_minutes} min
                        </div>
                        <div className="flex items-center gap-1">
                          <Trophy className="w-4 h-4" />
                          {module.points_reward} pts
                        </div>
                      </div>
                      
                      <Badge className={`w-fit ${disasterColors[module.disaster_type]} border`}>
                        {module.disaster_type.charAt(0).toUpperCase() + module.disaster_type.slice(1).replace('_', ' ')}
                      </Badge>
                    </CardHeader>
                    
                    <CardContent className="pt-0 flex-grow flex flex-col justify-end">
                      {progress?.completion_status === "completed" ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-green-600 font-medium flex items-center gap-1">
                              <CheckCircle className="w-4 h-4"/> Completed!
                            </span>
                            <span className="text-gray-500">
                              Score: {progress.quiz_score || 0}%
                            </span>
                          </div>
                          {getModuleAction(module)}
                        </div>
                      ) : progress?.completion_status === "in_progress" ? (
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-blue-600 font-medium">In Progress</span>
                              {/* Display specific progress percentage based on last_completed_step */}
                              <span>
                                {progress.last_completed_step === 'quiz' ? '75%' :
                                progress.last_completed_step === 'activity' ? '50%' :
                                progress.last_completed_step === 'learning' ? '25%' : '0%'}
                              </span>
                            </div>
                            <Progress value={
                              progress.last_completed_step === 'quiz' ? 75 :
                              progress.last_completed_step === 'activity' ? 50 :
                              progress.last_completed_step === 'learning' ? 25 : 0
                            } className="h-2" />
                          </div>
                          {getModuleAction(module)}
                        </div>
                      ) : (
                        getModuleAction(module)
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {getFilteredModules().length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No modules available</h3>
            <p className="text-gray-500">
              Check back later for new learning content in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
