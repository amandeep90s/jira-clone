'use client';

import { LogOutIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { useSignOut } from '@/features/auth/api/use-sign-out';

import { Navigation } from './navigation';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

export function Sidebar() {
  const { mutate: signOut } = useSignOut();

  return (
    <aside className="h-full w-full bg-neutral-100 p-4 dark:bg-neutral-900">
      <div className="flex h-full flex-col justify-between">
        <div className="flex-1">
          <Link href="/">
            <Image
              src="/logo.svg"
              height={56}
              width={152}
              alt="Logo"
              className="h-auto w-auto dark:hidden"
              loading="eager"
            />
            <Image
              src="/logo-light.svg"
              height={56}
              width={152}
              alt="Logo"
              className="hidden h-auto w-auto dark:block"
              loading="eager"
            />
          </Link>

          <Separator className="my-4" />

          <Navigation />
        </div>
        <Button
          variant={'outline'}
          className="text-foreground flex cursor-pointer items-center justify-center gap-2 font-medium"
          onClick={() => signOut()}
        >
          <LogOutIcon className="size-4" />
          Sign out
        </Button>
      </div>
    </aside>
  );
}
