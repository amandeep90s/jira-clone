'use client';

import { Loader, LogOutIcon } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';

import { useCurrent } from '../api/use-current';
import { useSignOut } from '../api/use-sign-out';

export const UserButton = () => {
  const { data: user, isLoading } = useCurrent();
  const { mutate: signOut } = useSignOut();

  if (isLoading) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 bg-neutral-200">
        <Loader className="text-muted-foreground size-4 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const { name, email } = user;

  const avatarFallback = name ? name.charAt(0).toUpperCase() : (email[0].toUpperCase() ?? 'U');

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="relative outline-none">
        <Avatar className="size-9 border border-neutral-300 transition hover:opacity-75">
          <AvatarFallback className="flex items-center justify-center bg-neutral-200 font-medium text-neutral-500">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="bottom" className="w-auto" sideOffset={10}>
        <div className="flex items-center justify-center gap-2 p-2.5">
          <Avatar className="size-13 border border-neutral-300 transition">
            <AvatarFallback className="flex items-center justify-center bg-neutral-200 text-xl font-medium text-neutral-500">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col items-start justify-center gap-2">
            <p className="text-foreground text-sm leading-none font-medium">{name || 'User'}</p>
            <p className="text-muted-foreground text-xs">{email}</p>
          </div>
        </div>

        <Separator className="my-1" />

        <DropdownMenuItem
          className="text-foreground flex cursor-pointer items-center justify-center gap-2 font-medium"
          onClick={() => signOut()}
        >
          <LogOutIcon className="size-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
