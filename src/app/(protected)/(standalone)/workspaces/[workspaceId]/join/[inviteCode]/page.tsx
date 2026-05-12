import { redirect } from 'next/navigation';

import { getUser } from '@/features/auth/queries';
import JoinWorkspaceForm from '@/features/workspaces/components/join-workspace-form';
import { getWorkspaceInfo } from '@/features/workspaces/queries';

interface JoinWorkspaceProps {
  params: Promise<{ workspaceId: string }>;
}

export default async function JoinWorkspace({ params }: JoinWorkspaceProps) {
  const { workspaceId } = await params;
  const user = await getUser();

  if (!user) redirect('/sign-in');

  const initialValues = await getWorkspaceInfo({ workspaceId });

  if (!initialValues) redirect('/');

  return (
    <div className="w-full lg:max-w-xl">
      <JoinWorkspaceForm initialValues={initialValues} />
    </div>
  );
}
