import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DrillVideoCard({ title, description, videoId, icon: Icon, color }) {
  return (
    <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-md flex flex-col bg-white">
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl bg-${color}-100`}>
            {Icon && <Icon className={`w-6 h-6 text-${color}-600`} />}
          </div>
          <div>
            <CardTitle className="text-lg line-clamp-2">{title}</CardTitle>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <div className="aspect-video w-full rounded-lg overflow-hidden border">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}`}
            title={`YouTube video player for ${title}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      </CardContent>
    </Card>
  );
}