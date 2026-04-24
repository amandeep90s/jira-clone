import React from 'react';

import { Navbar } from '@/components/navbar';
import { Sidebar } from '@/components/sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen">
      <div className="flex h-full w-full">
        <div className="fixed top-0 left-0 hidden h-full overflow-y-auto lg:block lg:w-70">
          <Sidebar />
        </div>
        <div className="w-full lg:pl-70">
          <div className="container mx-auto h-full">
            <Navbar />
            <main className="flex h-full flex-col px-6 py-8">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
}
