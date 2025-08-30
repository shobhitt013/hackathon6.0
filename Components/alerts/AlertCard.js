import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertTriangle,
  Zap,
  Flame,
  Waves,
  Wind,
  Megaphone,
  AlertOctagon,
  Info,
  Clock
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const alertIcons = {
  earthquake: Zap,
  fire: Flame,
  flood: Waves,
  cyclone: Wind,
  drill: Megaphone,
  general_emergency: AlertOctagon
};

const severityConfig = {
  critical: { color: 'red', label: 'Critical' },
  high: { color: 'orange', label: 'High' },
  medium: { color: 'yellow', label: 'Medium' },
  low: { color: 'blue', label: 'Low' },
};

export default function AlertCard({ alert }) {
  const Icon = alertIcons[alert.alert_type] || AlertTriangle;
  const config = severityConfig[alert.severity] || { color: 'gray', label: 'Info' };

  return (
    <Card className={`border-l-4 border-${config.color}-500 bg-white shadow-md transition-all hover:shadow-lg`}>
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div className="flex items-center gap-3">
            <div className={`hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-${config.color}-100`}>
              <Icon className={`w-6 h-6 text-${config.color}-600`} />
            </div>
            <CardTitle>{alert.title}</CardTitle>
          </div>
          <Badge className={`bg-${config.color}-100 text-${config.color}-700 border border-${config.color}-200 whitespace-nowrap`}>
            {config.label}
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500 pt-2">
            <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>
                Issued {formatDistanceToNow(new Date(alert.created_date), { addSuffix: true })}
                </span>
            </div>
             <div className="flex items-center gap-1.5 capitalize">
                <Icon className="w-4 h-4" />
                <span>
                {alert.alert_type.replace('_', ' ')}
                </span>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-4">{alert.message}</p>
        {alert.instructions && (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="font-semibold flex items-center gap-2 mb-2 text-gray-800">
              <Info className="w-4 h-4 text-blue-600" />
              Follow These Instructions
            </h4>
            <p className="text-sm text-gray-800 whitespace-pre-wrap">{alert.instructions}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}