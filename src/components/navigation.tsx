'use client';

import { HomeIcon, SettingsIcon, UsersIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { GoCheckCircle, GoCheckCircleFill } from 'react-icons/go';

import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { cn } from '@/lib/utils';

type RoutesType = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  activeIcon: React.ComponentType<{ className?: string }>;
};

const routes: RoutesType[] = [
  {
    label: 'Home',
    href: '/',
    icon: HomeIcon,
    activeIcon: HomeIcon,
  },
  {
    label: 'My Tasks',
    href: '/my-tasks',
    icon: GoCheckCircle,
    activeIcon: GoCheckCircleFill,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: SettingsIcon,
    activeIcon: SettingsIcon,
  },
  {
    label: 'Members',
    href: '/members',
    icon: UsersIcon,
    activeIcon: UsersIcon,
  },
] as const;

export function Navigation() {
  const pathname = usePathname();
  const workspaceId = useWorkspaceId();

  return (
    <div className="flex flex-col gap-1">
      {routes.map((route) => {
        const fullHref = `/workspaces/${workspaceId}${route.href}`;
        const isActive = pathname === fullHref;
        const Icon = isActive ? route.activeIcon : route.icon;

        return (
          <Link key={route.href} href={fullHref}>
            <div
              className={cn(
                'flex cursor-pointer items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium',
                isActive
                  ? 'bg-primary text-white'
                  : 'text-neutral-700 hover:bg-neutral-200 dark:text-neutral-300 dark:hover:bg-neutral-700',
              )}
            >
              <Icon
                className={cn('size-5', isActive ? 'bg-primary text-white' : 'text-neutral-700 dark:text-neutral-300')}
              />
              {route.label}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
