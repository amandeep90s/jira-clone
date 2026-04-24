import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { Navigation } from './navigation';
import { Separator } from './ui/separator';

export function Sidebar() {
  return (
    <aside className="h-full w-full bg-neutral-100 p-4 dark:bg-neutral-900">
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
    </aside>
  );
}
