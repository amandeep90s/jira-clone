import { redirect } from 'next/navigation';

import { getUser } from '@/features/auth/actions';

export default async function WorkspaceDetail() {
  const user = await getUser();

  if (!user) redirect('/sign-in');
  
  return <div>WorkspaceDetailPage</div>;
}
