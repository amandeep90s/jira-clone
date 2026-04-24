import { redirect } from 'next/navigation';

import { getUser } from '@/features/auth/actions';

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default async function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const user = await getUser();

  if (!user) {
    redirect('/sign-in');
  }

  return <>{children}</>;
}
