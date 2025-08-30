import React from 'react';
import { Button } from '@/components/ui/button';
import { Award, Trophy, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function ModuleCompleteScreen({ score, module, badge }) {
  const navigate = useNavigate();
  
  return (
    <div className="text-center flex flex-col items-center justify-center">
      <Trophy className="w-24 h-24 text-yellow-400" />
      <h1 className="text-4xl font-bold mt-4">Module Complete!</h1>
      <p className="text-lg text-gray-600 mt-2">Congratulations, you've successfully finished the module.</p>
      
      <div className="my-8 flex justify-center gap-8 text-xl">
        <div className="text-center">
          <p className="font-bold text-3xl text-green-600">{score}%</p>
          <p className="text-sm text-gray-500">Quiz Score</p>
        </div>
        <div className="text-center">
          <p className="font-bold text-3xl text-blue-600">+{module.points_reward}</p>
          <p className="text-sm text-gray-500">Points Earned</p>
        </div>
      </div>

      {badge && (
        <div className="bg-gray-100 rounded-xl p-6 mt-4 w-full max-w-sm">
          <h3 className="font-semibold text-lg mb-2">New Badge Unlocked!</h3>
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center`}>
              <Award className="w-10 h-10 text-white" />
            </div>
            <div>
              <p className="font-bold text-xl">{badge.name}</p>
              <p className="text-sm text-gray-600">{badge.description}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-12">
        <Button onClick={() => navigate(createPageUrl('Learning'))}>
          Back to Learning Modules <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}