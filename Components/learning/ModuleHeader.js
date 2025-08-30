import React from 'react';
import { BookOpen, Gamepad2, ListChecks, Award, ArrowRight } from 'lucide-react';

const steps = [
  { key: 'learning', title: 'Learning', icon: BookOpen },
  { key: 'activity', title: 'Activity', icon: Gamepad2 },
  { key: 'quiz', title: 'Quiz', icon: ListChecks },
  { key: 'badge', title: 'Badge', icon: Award }
];

export default function ModuleHeader({ currentStep }) {
  const getStepIndex = (stepKey) => {
    if (stepKey === 'complete') return 3;
    return steps.findIndex(s => s.key === stepKey);
  };
  
  const currentStepIndex = getStepIndex(currentStep);

  return (
    <div className="w-full bg-white rounded-2xl shadow-md p-4">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.key}>
            <div className="flex flex-col items-center text-center w-20">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                ${currentStepIndex >= index ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}
              `}>
                <step.icon className="w-6 h-6" />
              </div>
              <p className={`mt-2 text-xs font-semibold transition-colors duration-300
                ${currentStepIndex >= index ? 'text-blue-600' : 'text-gray-500'}
              `}>
                {step.title}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 px-2">
                 <ArrowRight className={`w-6 h-6 transition-colors duration-300 mx-auto
                  ${currentStepIndex > index ? 'text-blue-500' : 'text-gray-300'}
                 `} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}