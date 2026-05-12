import { redirect } from 'next/navigation';

import { SignInCard } from '@/features/auth/components/sign-in-card';
import { getUser } from '@/features/auth/queries';

export default async function SignIn() {
  const user = await getUser();

  if (user) {
    redirect('/');
  }

  return <SignInCard />;
}
