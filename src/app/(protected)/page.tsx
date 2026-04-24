'use client';

import { UserButton } from '@/features/auth/components/user-button';

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1>Jira Clone</h1>

      <UserButton />
    </div>
  );
}
