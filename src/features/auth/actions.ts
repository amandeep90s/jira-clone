import 'server-only';

import { cookies } from 'next/headers';
import { Account, Client } from 'node-appwrite';

import { AUTH_COOKIE_NAME } from './constants';

const getRequiredEnv = (name: 'NEXT_PUBLIC_APPWRITE_ENDPOINT' | 'NEXT_PUBLIC_APPWRITE_PROJECT') => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

/**
 * Get the currently authenticated user.
 * @returns The authenticated user, or null if not authenticated or if fetching the user information fails.
 */
export const getUser = async () => {
  const endpoint = getRequiredEnv('NEXT_PUBLIC_APPWRITE_ENDPOINT');
  const project = getRequiredEnv('NEXT_PUBLIC_APPWRITE_PROJECT');

  try {
    const client = new Client().setEndpoint(endpoint).setProject(project);
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
