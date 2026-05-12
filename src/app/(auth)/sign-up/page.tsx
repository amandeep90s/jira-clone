import { redirect } from 'next/navigation';

import { SignUpCard } from '@/features/auth/components/sign-up-card';
import { getUser } from '@/features/auth/queries';

export default async function SignUp() {
  const user = await getUser();

  if (user) {
    redirect('/');
  }

  return <SignUpCard />;
}
