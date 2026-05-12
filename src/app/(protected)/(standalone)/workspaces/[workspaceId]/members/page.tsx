import { redirect } from 'next/navigation';

import { getUser } from '@/features/auth/queries';
import MembersList from '@/features/workspaces/components/members-list';

export default async function WorkspaceMembers() {
  const user = await getUser();

  if (!user) redirect('/sign-in');

  return (
    <div className="w-full lg:max-w-xl">
      <MembersList />
    </div>
  );
}
