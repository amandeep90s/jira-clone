import { redirect } from 'next/navigation';

import { getUser } from '@/features/auth/actions';
import { getWorkspace } from '@/features/workspaces/actions';
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

  return <EditWorkspaceForm initialValues={workspace} />;
}
