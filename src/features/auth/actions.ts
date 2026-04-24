import 'server-only';

import { cookies } from 'next/headers';
import { Account, Client } from 'node-appwrite';

import { AUTH_COOKIE_NAME } from './constants';

/**
 * Get the currently authenticated user.
 * @returns The authenticated user or null if not authenticated.
 */
export const getUser = async () => {
  try {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    const session = (await cookies()).get(AUTH_COOKIE_NAME);

    if (!session) {
      return null;
    }

    client.setSession(session.value);

    const account = new Account(client);

    return await account.get();
  } catch {
    return null;
  }
};
