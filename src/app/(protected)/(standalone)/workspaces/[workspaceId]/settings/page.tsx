import { redirect } from 'next/navigation';

import { getUser } from '@/features/auth/actions';

interface WorkspaceSettingsProps {
  params: Promise<{ workspaceId: string }>;
}

export default async function WorkspaceSettings({ params }: WorkspaceSettingsProps) {
  const { workspaceId } = await params;
  const user = await getUser();

  if (!user) redirect('/sign-in');

  return <div>WorkspaceSettings {workspaceId}</div>;
}
