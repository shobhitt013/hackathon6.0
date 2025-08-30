import React, { useState, useEffect } from 'react';
import { User } from '@/entities/User';
import { EmergencyAlert } from '@/entities/EmergencyAlert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AlertCard from '../components/alerts/AlertCard';
import DrillVideoCard from '../components/drills/DrillVideoCard';
import { AlertTriangle, Archive, Video, Zap, Flame, Waves } from 'lucide-react';

const preparednessVideos = [
  {
    title: 'What To Do In An Earthquake',
    description: 'A quick guide on how to react when you receive an earthquake alert.',
    videoId: 'S6yQb9C2n1I',
    icon: Zap,
    color: 'yellow',
  },
  {
    title: 'Responding to a Fire Alert',
    description: 'Learn the immediate actions to take when a fire alarm sounds.',
    videoId: '09aJ9_3aGfE',
    icon: Flame,
    color: 'red',
  },
  {
    title: 'Flood Alert: Evacuation & Safety',
    description: 'Key steps to ensure your safety during a flood warning.',
    videoId: 'yOolB-4-2eQ',
    icon: Waves,
    color: 'blue',
  },
];

export default function AlertsPage() {
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [archivedAlerts, setArchivedAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    setIsLoading(true);
    try {
      const user = await User.me();
      const [active, archived] = await Promise.all([
        EmergencyAlert.filter({ is_active: true, target_regions: user.region }, '-created_date', 50),
        EmergencyAlert.filter({ is_active: false, target_regions: user.region }, '-created_date', 20),
      ]);
      setActiveAlerts(active);
      setArchivedAlerts(archived);
    } catch (error) {
      console.error("Error loading alerts:", error);
    }
    setIsLoading(false);
  };

  const renderAlertList = (alerts) => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <div className="h-40 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-40 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      );
    }

    if (alerts.length === 0) {
      return (
        <div className="text-center py-16 text-gray-500 bg-white rounded-lg shadow-sm">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold">No Alerts Found</h3>
          <p>There are no alerts matching this category for your region.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {alerts.map((alert) => (
          <AlertCard key={alert.id} alert={alert} />
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-red-50 to-orange-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Emergency Alerts
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Stay informed about active and past emergency alerts in your region.
            Your safety is our priority.
          </p>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white shadow-sm">
            <TabsTrigger value="active" className="data-[state=active]:bg-red-50 data-[state=active]:text-red-700">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Active Alerts ({activeAlerts.length})
            </TabsTrigger>
            <TabsTrigger value="archived" className="data-[state=active]:bg-gray-100">
              <Archive className="w-4 h-4 mr-2" />
              Archived
            </TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="mt-8">
            {renderAlertList(activeAlerts)}
          </TabsContent>
          <TabsContent value="archived" className="mt-8">
            {renderAlertList(archivedAlerts)}
          </TabsContent>
        </Tabs>
        
        <div className="space-y-8 pt-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-3">
              <Video className="w-8 h-8 text-blue-600"/>
              Preparedness Guides
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Watch these short videos to learn how to respond effectively when you receive an alert.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {preparednessVideos.map((video) => (
              <DrillVideoCard
                key={video.videoId}
                title={video.title}
                description={video.description}
                videoId={video.videoId}
                icon={video.icon}
                color={video.color}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}