'use client';

import { useRouter } from 'next/navigation';
import { RiAddCircleLine } from 'react-icons/ri';

import { useGetWorkspaces } from '@/features/workspaces/api/use-get-workspaces';
import WorkspaceAvatar from '@/features/workspaces/components/workspace-avatar';
import { useCreateWorkspaceModal } from '@/features/workspaces/hooks/use-create-workspace-modal';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Skeleton } from './ui/skeleton';

export default function WorkspaceSwitcher() {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { open } = useCreateWorkspaceModal();

  const { data: workspaces, isLoading, error } = useGetWorkspaces();

  const handleValueChange = (workspaceId: string) => {
    router.push(`/workspaces/${workspaceId}`);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-y-2">
        <Skeleton className="h-5 w-full rounded-md" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-neutral-500 uppercase">Workspaces</p>
        <RiAddCircleLine
          onClick={open}
          className="size-5 cursor-pointer text-neutral-500 transition hover:opacity-75"
        />
      </div>
      <Select onValueChange={handleValueChange} value={workspaceId ?? ''}>
        <SelectTrigger className="w-full bg-neutral-200 px-2 font-medium">
          <SelectValue placeholder="No workspace selected" />
        </SelectTrigger>
        <SelectContent>
          {workspaces?.rows?.map((workspace) => (
            <SelectItem key={workspace.$id} value={workspace.$id}>
              <div className="flex items-center justify-start gap-3 font-medium">
                <WorkspaceAvatar name={workspace.name} image={workspace.imageUrl} className="size-6" />
                <span className="truncate">{workspace.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
