'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RiAddCircleLine } from 'react-icons/ri';

import { useGetProjects } from '@/features/projects/api/use-get-projects';
import ProjectAvatar from '@/features/projects/components/project-avatar';
import { useCreateProjectModal } from '@/features/projects/hooks/use-create-project-modal';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { cn } from '@/lib/utils';

import { Skeleton } from './ui/skeleton';

export function Projects() {
  const workspaceId = useWorkspaceId();
  const { data: projects, isLoading } = useGetProjects({ workspaceId });
  const pathname = usePathname();
  const { open } = useCreateProjectModal();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-y-2">
        <Skeleton className="h-5 w-full rounded-md" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-neutral-500 uppercase">Projects</p>
        <RiAddCircleLine
          onClick={open}
          className="size-5 cursor-pointer text-neutral-500 transition hover:opacity-75"
        />
      </div>

      {projects?.rows.map((project) => {
        const projectHref = `/workspaces/${workspaceId}/projects/${project.$id}`;
        const isActive = pathname === projectHref;

        return (
          <Link key={project.$id} href={projectHref}>
            <div
              className={cn(
                'flex cursor-pointer items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium',
                isActive
                  ? 'bg-primary text-white'
                  : 'text-neutral-700 hover:bg-neutral-200 dark:text-neutral-300 dark:hover:bg-neutral-700',
              )}
            >
              <ProjectAvatar name={project.name} image={project.imageUrl} className="size-6 shrink-0" />
              <span className="truncate">{project.name}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
