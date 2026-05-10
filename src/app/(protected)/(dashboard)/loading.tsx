import { Loader } from 'lucide-react';
import React from 'react';

export default function DashboardLoading() {
  return (
    <div className="flex h-full items-center justify-center">
      <Loader className="text-muted-foreground size-6 animate-spin" size={24} />
    </div>
  );
}
