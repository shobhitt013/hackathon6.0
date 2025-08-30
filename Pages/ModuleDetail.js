
import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { User } from "@/entities/User";
import { LearningModule } from "@/entities/LearningModule";
import { UserProgress } from "@/entities/UserProgress";
import { Badge as BadgeEntity } from "@/entities/Badge";
import { createPageUrl } from "@/utils";
import ModuleHeader from "../components/learning/ModuleHeader";
import LearningContent from "../components/learning/LearningContent";
import InteractiveActivity from "../components/learning/InteractiveActivity";
import QuizView from "../components/learning/QuizView";
import ModuleCompleteScreen from "../components/learning/ModuleCompleteScreen";

export default function ModuleDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const [module, setModule] = useState(null);
  const [progress, setProgress] = useState(null);
  const [user, setUser] = useState(null);
  const [currentStep, setCurrentStep] = useState("loading"); // loading, learning, activity, quiz, complete
  const [badge, setBadge] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadModuleData = useCallback(async () => {
    setIsLoading(true);
    const params = new URLSearchParams(location.search);
    const moduleId = params.get("id");

    if (!moduleId) {
      navigate(createPageUrl("Learning"));
      return;
    }

    try {
      // Changed to use LearningModule.filter to retrieve by id, which returns an array
      const [userData, moduleDataList] = await Promise.all([
        User.me(),
        LearningModule.filter({ id: moduleId }),
      ]);
      
      // Check if module was found in the filtered list
      if (moduleDataList.length === 0) {
        navigate(createPageUrl("Learning"));
        return;
      }
      
      const moduleData = moduleDataList[0]; // Get the first (and only) module
      setUser(userData);
      setModule(moduleData);

      // Renamed variable to progressDataList as UserProgress.filter returns an array
      let progressDataList = await UserProgress.filter({ user_id: userData.id, module_id: moduleId });
      
      let progressData;
      if (progressDataList.length === 0) {
        progressData = await UserProgress.create({
          user_id: userData.id,
          module_id: moduleId,
          completion_status: "in_progress",
        });
      } else {
        progressData = progressDataList[0]; // Get the first (and only) progress record
      }
      setProgress(progressData);

      if (progressData.completion_status === "completed") {
        setCurrentStep("complete");
        if(moduleData.badge_reward) {
          // Used BadgeEntity as per import alias
          const badgeDataList = await BadgeEntity.filter({ name: moduleData.badge_reward });
          if (badgeDataList.length > 0) setBadge(badgeDataList[0]);
        }
      } else if (progressData.last_completed_step === "quiz") {
        setCurrentStep("complete");
      } else if (progressData.last_completed_step === "activity") {
        setCurrentStep("quiz");
      } else if (progressData.last_completed_step === "learning") {
        setCurrentStep("activity");
      } else {
        setCurrentStep("learning");
      }
    } catch (error) {
      console.error("Error loading module:", error);
      navigate(createPageUrl("Learning"));
    }
    setIsLoading(false);
  }, [location.search, navigate]);

  useEffect(() => {
    loadModuleData();
  }, [loadModuleData]);

  const handleStepComplete = async (step, data) => {
    if (!progress) return;

    let updatedProgress = { ...progress };
    let updatedUser = { ...user };
    
    if (step === "learning") {
      // Reordered assignment to occur after successful API update
      await UserProgress.update(progress.id, { last_completed_step: "learning" });
      updatedProgress.last_completed_step = "learning";
      setProgress(updatedProgress);
      setCurrentStep("activity");
    } else if (step === "activity") {
      // Reordered assignment to occur after successful API update
      await UserProgress.update(progress.id, { last_completed_step: "activity" });
      updatedProgress.last_completed_step = "activity";
      setProgress(updatedProgress);
      setCurrentStep("quiz");
    } else if (step === "quiz") {
      const { score } = data;
      updatedProgress = {
        ...updatedProgress,
        last_completed_step: "quiz",
        completion_status: "completed",
        quiz_score: score,
        completion_date: new Date().toISOString(),
      };
      await UserProgress.update(progress.id, { 
        last_completed_step: "quiz", 
        completion_status: "completed", 
        quiz_score: score, 
        completion_date: new Date().toISOString()
      });
      
      // Update user points and badges
      const points_earned = module.points_reward || 0;
      updatedUser.total_points = (user.total_points || 0) + points_earned;
      
      let newBadge = null;
      if (module.badge_reward && !user.badges_earned?.includes(module.badge_reward)) {
        updatedUser.badges_earned = [...(user.badges_earned || []), module.badge_reward];
        // Used BadgeEntity as per import alias
        const badgeDataList = await BadgeEntity.filter({ name: module.badge_reward });
        if (badgeDataList.length > 0) {
            newBadge = badgeDataList[0];
            setBadge(newBadge);
        }
      }
      
      // Changed to use User.updateMyUserData, assuming it updates the current user without needing an ID
      await User.updateMyUserData({ 
        total_points: updatedUser.total_points, 
        badges_earned: updatedUser.badges_earned 
      });

      setUser(updatedUser);
      setProgress(updatedProgress);
      setCurrentStep("complete");
    }
  };

  const renderContent = () => {
    if (isLoading || !module) {
      return <div className="text-center p-12">Loading module...</div>;
    }

    switch (currentStep) {
      case "learning":
        return <LearningContent module={module} onComplete={() => handleStepComplete("learning")} />;
      case "activity":
        return <InteractiveActivity module={module} onComplete={() => handleStepComplete("activity")} />;
      case "quiz":
        return <QuizView module={module} onComplete={(data) => handleStepComplete("quiz", data)} />;
      case "complete":
        return <ModuleCompleteScreen score={progress?.quiz_score} module={module} badge={badge} />;
      default:
        return <div className="text-center p-12">Loading...</div>;
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <ModuleHeader currentStep={currentStep} />
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 md:p-10 min-h-[500px]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
