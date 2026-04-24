import { redirect } from 'next/navigation';

import { getUser } from '@/features/auth/actions';
import { SignUpCard } from '@/features/auth/components/sign-up-card';

export default async function SignUp() {
  const user = await getUser();

  if (user) {
    redirect('/');
  }

  return <SignUpCard />;
}
