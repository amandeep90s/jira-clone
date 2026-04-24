import { UserButton } from '@/features/auth/components/user-button';

import { MobileSidebar } from './mobile-sidebar';

export function Navbar() {
  return (
    <nav className="flex w-full items-center justify-between border-b px-6 py-4">
      <div className="hidden flex-col lg:flex">
        <h1 className="text-2xl font-semibold">Home</h1>
        <p className="text-muted-foreground">Monitor all of your projects and tasks here</p>
      </div>

      <MobileSidebar />
      <UserButton />
    </nav>
  );
}
