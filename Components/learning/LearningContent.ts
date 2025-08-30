import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function LearningContent({ module, onComplete }) {
  return (
    <div className="prose max-w-none">
      <h1 className="text-3xl font-bold mb-4">{module.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: module.content }} />
      <div className="mt-8 flex justify-end">
        <Button onClick={onComplete}>
          Next: Activity <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}