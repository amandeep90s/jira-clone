'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/ui/mode-toggle';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const pathname = usePathname();
  const isSignInPage = pathname === '/sign-in';

  return (
    <main className="min-h-screen bg-neutral-100 dark:bg-neutral-900">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex items-center justify-between">
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

          <div className="flex items-center gap-2">
            <ModeToggle />
            <Button variant={'outline'} asChild>
              <Link href={isSignInPage ? '/sign-up' : '/sign-in'}>{isSignInPage ? 'Sign Up' : 'Sign In'}</Link>
            </Button>
          </div>
        </nav>

        <div className="flex flex-col items-center justify-center pt-4 md:pt-14">{children}</div>
      </div>
    </main>
  );
}
