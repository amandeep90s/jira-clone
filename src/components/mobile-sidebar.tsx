'use client';

import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { MenuIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

import { Sidebar } from './sidebar';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from './ui/sheet';

export function MobileSidebar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => {
      setIsOpen(false);
    });
  }, [pathname, startTransition]);

  return (
    <Sheet modal={false} open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant={'outline'} className="lg:hidden">
          <MenuIcon className="size-5 text-neutral-500 dark:text-neutral-300" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="p-0">
        <VisuallyHidden>
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>Mobile navigation menu</SheetDescription>
        </VisuallyHidden>
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
}
