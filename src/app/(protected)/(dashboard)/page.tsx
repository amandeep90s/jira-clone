import { redirect } from 'next/navigation';

import { getUser } from '@/features/auth/queries';
import { getWorkspaces } from '@/features/workspaces/actions';

export default async function Home() {
  const user = await getUser();

  if (!user) redirect('/sign-in');

  const workspaces = await getWorkspaces();

  if (workspaces.total === 0) {
    redirect('/workspaces/create');
  } else {
    redirect(`/workspaces/${workspaces.rows[0].$id}`);
  }
}
