import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import React from 'react';
import { useMedia } from 'react-use';

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from '@/components/ui/drawer';

interface ResponsiveModalProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ResponsiveModal({ children, open, onOpenChange }: ResponsiveModalProps) {
  const isDesktop = useMedia('(min-width: 1024px)', true);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="hide-scrollbar max-h-[85vh] w-full overflow-y-auto border-none p-0 sm:max-w-lg">
          <VisuallyHidden>
            <DialogTitle>Create Workspace</DialogTitle>
            <DialogDescription>Create a new workspace</DialogDescription>
          </VisuallyHidden>
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <VisuallyHidden>
          <DrawerTitle>Create Workspace</DrawerTitle>
          <DrawerDescription>Create a new workspace</DrawerDescription>
        </VisuallyHidden>
        <div className="hide-scrollbar max-h-[85vh] overflow-y-auto">{children}</div>
      </DrawerContent>
    </Drawer>
  );
}
