import { redirect } from 'next/navigation';

import { getUser } from '@/features/auth/queries';
import { getWorkspace } from '@/features/workspaces/queries';
import { EditWorkspaceForm } from '@/features/workspaces/components/edit-workspace-form';

interface WorkspaceSettingsProps {
  params: Promise<{ workspaceId: string }>;
}

export default async function WorkspaceSettings({ params }: WorkspaceSettingsProps) {
  const { workspaceId } = await params;
  const user = await getUser();

  if (!user) redirect('/sign-in');

  const workspace = await getWorkspace({ workspaceId });

  if (!workspace) redirect(`/workspaces/${workspaceId}`);

  return (
    <div className="w-full lg:max-w-2xl">
      <EditWorkspaceForm initialValues={workspace} />
    </div>
  );
}
