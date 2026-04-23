'use client';

import { LogOutIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useSignOut } from '@/features/auth/api/use-sign-out';

export default function Home() {
  const { mutate } = useSignOut();

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1>Jira Clone</h1>

      <Button onClick={() => mutate()}>
        <LogOutIcon size={5} /> Sign Out
      </Button>
    </div>
  );
}
