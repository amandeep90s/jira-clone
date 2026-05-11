import { redirect } from 'next/navigation';

import { getUser } from '@/features/auth/queries';
import { CreateWorkspaceForm } from '@/features/workspaces/components/create-workspace-form';

export default async function CreateWorkspace() {
  const user = await getUser();

  if (!user) redirect('/sign-in');

  return (
    <div className="w-full lg:max-w-xl">
      <CreateWorkspaceForm />
    </div>
  );
}
