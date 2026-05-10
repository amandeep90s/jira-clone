import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { ModeToggle } from '@/components/ui/mode-toggle';
import { UserButton } from '@/features/auth/components/user-button';

interface StandaloneLayoutProps {
  children: React.ReactNode;
}

export default function StandaloneLayout({ children }: StandaloneLayoutProps) {
  return (
    <main className="min-h-screen bg-neutral-100 dark:bg-neutral-900">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex h-15 items-center justify-between">
          <Link href="/">
            <Image
              src="/logo.svg"
              height={56}
              width={152}
              alt="Logo"
              className="h-auto w-auto dark:hidden"
              loading="eager"
            />
          </Link>

          <div className="flex items-center gap-2">
            <ModeToggle />
            <UserButton />
          </div>
        </nav>
        <div className="flex flex-col items-center justify-center py-4">{children}</div>
      </div>
    </main>
  );
}
