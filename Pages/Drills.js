import React from 'react';
import DrillVideoCard from '../components/drills/DrillVideoCard';
import { Zap, Flame, Waves, Wind, Heart } from 'lucide-react';

const drillVideos = [
  {
    title: 'Earthquake Drill: Drop, Cover, Hold On',
    description: 'Learn the life-saving "Drop, Cover, and Hold On" technique for earthquake safety.',
    videoId: 'GSDmq_R_t0I',
    icon: Zap,
    color: 'yellow',
  },
  {
    title: 'Fire Evacuation Drill: Get Out, Stay Out',
    description: 'Practice how to safely evacuate a building during a fire emergency.',
    videoId: 'FRv_y6bVh_Y',
    icon: Flame,
    color: 'red',
  },
  {
    title: 'Flood Safety: Turn Around, Don\'t Drown',
    description: 'Understand the dangers of floodwater and why you should never drive or walk through it.',
    videoId: 'eH64-H5e-a4',
    icon: Waves,
    color: 'blue',
  },
  {
    title: 'Tornado/Cyclone Drill: Get In, Get Down, Cover Up',
    description: 'Follow these steps to stay safe when a tornado or cyclone warning is issued.',
    videoId: 'UNZk_T0sC0U',
    icon: Wind,
    color: 'gray',
  },
  {
    title: 'First Aid: Hands-Only CPR Practice',
    description: 'A simple two-step technique to help save a life from cardiac arrest.',
    videoId: 'M4ACY_tYg5A',
    icon: Heart,
    color: 'pink',
  },
];

export default function DrillsPage() {
  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Practice Drills & Procedures
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Watching and practicing these drills can make your response fast and effective in a real emergency.
            Familiarize yourself with these life-saving actions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {drillVideos.map((drill) => (
            <DrillVideoCard
              key={drill.videoId}
              title={drill.title}
              description={drill.description}
              videoId={drill.videoId}
              icon={drill.icon}
              color={drill.color}
            />
          ))}
        </div>
      </div>
    </div>
  );
}