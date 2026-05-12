'use client';

import { ArrowLeftIcon, MoreVerticalIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useDeleteMember } from '@/features/members/api/use-delete-member';
import { useGetMembers } from '@/features/members/api/use-get-members';
import { useUpdateMember } from '@/features/members/api/use-update-member';
import MemberAvatar from '@/features/members/components/member-avatar';
import { MemberRole } from '@/features/members/types';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { useConfirm } from '@/hooks/use-confirm';

export default function MembersList() {
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const { data, isLoading, isError, error } = useGetMembers({ workspaceId });
  const { mutate: deleteMember, isPending: isDeleting } = useDeleteMember();
  const { mutate: updateMember, isPending: isUpdating } = useUpdateMember();

  const [ConfirmDialog, confirm] = useConfirm(
    'Remove Member',
    'Are you sure you want to remove this member from the workspace? This action cannot be undone.',
  );

  const handleUpdateMemberRole = (memberId: string, newRole: MemberRole) => {
    updateMember(
      { memberId, form: { role: newRole } },
      {
        onSuccess: () => {
          toast.success('Member role updated successfully!');
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  };

  const handleRemoveMember = async (memberId: string, memberName: string) => {
    const confirmed = await confirm();
    if (!confirmed) return;

    deleteMember(
      { param: { memberId } },
      {
        onSuccess: () => {
          toast.success(`${memberName} has been removed from the workspace.`);
          router.refresh();
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  };

  if (isError) {
    return (
      <Card className="h-full w-full border-none shadow-none">
        <CardContent className="text-destructive flex items-center justify-center py-10 text-sm">
          {error?.message ?? 'Failed to load members.'}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="h-full w-full border-none shadow-none">
        <CardHeader className="flex flex-row items-center space-y-0 gap-x-4">
          <Button variant={'secondary'} size="sm" asChild>
            <Link href={`/workspaces/${workspaceId}`}>
              <ArrowLeftIcon size={4} />
              Back
            </Link>
          </Button>
          <CardTitle className="text-xl font-bold">Members List</CardTitle>
        </CardHeader>
        <CardContent>
          <Separator />
          <div className="mt-4 flex flex-col gap-y-2">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-x-3 py-2">
                    <Skeleton className="size-9 rounded-full" />
                    <div className="flex flex-col gap-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                ))
              : data?.documents.map((member, index) => (
                  <div key={member.$id}>
                    <div className="flex items-center gap-x-3 py-2">
                      <MemberAvatar name={member.name} fallbackClassName="text-lg" />
                      <div className="flex flex-1 flex-col">
                        <p className="text-sm font-medium">{member.name as string}</p>
                        <p className="text-muted-foreground text-xs">{member.email as string}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="secondary" size="icon" className="ml-auto">
                            <MoreVerticalIcon />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-full" side="bottom" align="end">
                          <DropdownMenuItem
                            className="font-medium"
                            disabled={isDeleting || isUpdating}
                            onClick={() => handleUpdateMemberRole(member.$id, MemberRole.ADMIN)}
                          >
                            Set as Administrator
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="font-medium"
                            disabled={isDeleting || isUpdating}
                            onClick={() => handleUpdateMemberRole(member.$id, MemberRole.MEMBER)}
                          >
                            Set as Member
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            disabled={isDeleting || isUpdating}
                            onClick={() => handleRemoveMember(member.$id, member.name)}
                            className="text-destructive focus:text-destructive font-medium"
                          >
                            Remove {member.name}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    {index < data.documents.length - 1 && <Separator />}
                  </div>
                ))}
          </div>
        </CardContent>
      </Card>
      <ConfirmDialog />
    </>
  );
}
