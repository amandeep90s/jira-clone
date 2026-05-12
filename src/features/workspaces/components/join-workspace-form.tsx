'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useJoinWorkspace } from '@/features/workspaces/api/use-join-workspace';
import { useInviteCode } from '@/features/workspaces/hooks/use-invite-code';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';

interface JoinWorkspaceFormProps {
  initialValues: {
    name: string;
  };
}

export default function JoinWorkspaceForm({ initialValues }: JoinWorkspaceFormProps) {
  const inviteCode = useInviteCode();
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const { mutate, isPending } = useJoinWorkspace();

  const onSubmit = () => {
    mutate(
      { param: { workspaceId }, json: { inviteCode } },
      {
        onSuccess: ({ data }) => {
          toast.success('Successfully joined the workspace!');
          router.push(`/workspaces/${data.$id}`);
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to join the workspace. Please try again.');
        },
      },
    );
  };

  return (
    <Card className="h-full w-full border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Join Workspace</CardTitle>
        <CardDescription>
          You&apos;ve been invited to join the workspace <strong>{initialValues.name}</strong>
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col items-center justify-between gap-2 lg:flex-row">
        <Button className="w-full lg:w-fit" asChild type="button" variant={'outline'} size="lg" disabled={isPending}>
          <Link href="/">Cancel</Link>
        </Button>
        <Button className="w-full lg:w-fit" size="lg" onClick={onSubmit} disabled={isPending}>
          {isPending && <Spinner data-icon="inline-start" />}
          {isPending ? 'Joining...' : 'Join Workspace'}
        </Button>
      </CardContent>
    </Card>
  );
}
