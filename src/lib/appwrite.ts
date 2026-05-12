import 'server-only';

import { cookies } from 'next/headers';
import { Account, Client, TablesDB, Users } from 'node-appwrite';

import { APPWRITE_ENDPOINT, APPWRITE_KEY, APPWRITE_PROJECT } from '@/config';
import { AUTH_COOKIE } from '@/features/auth/constants';

const endpoint = APPWRITE_ENDPOINT;
const project = APPWRITE_PROJECT;
const apiKey = APPWRITE_KEY;

if (!endpoint || !project || !apiKey) {
  throw new Error(
    `Missing required Appwrite environment variables: ${[
      !endpoint && 'NEXT_PUBLIC_APPWRITE_ENDPOINT',
      !project && 'NEXT_PUBLIC_APPWRITE_PROJECT',
      !apiKey && 'NEXT_APPWRITE_KEY',
    ]
      .filter(Boolean)
      .join(', ')}`,
  );
}

const getRequiredEnv = (name: 'NEXT_PUBLIC_APPWRITE_ENDPOINT' | 'NEXT_PUBLIC_APPWRITE_PROJECT') => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

export async function createSessionClient() {
  const endpoint = getRequiredEnv('NEXT_PUBLIC_APPWRITE_ENDPOINT');
  const project = getRequiredEnv('NEXT_PUBLIC_APPWRITE_PROJECT');
  try {
    const client = new Client().setEndpoint(endpoint).setProject(project);

    const session = (await cookies()).get(AUTH_COOKIE);

    if (!session || !session.value) {
      throw new Error('Unauthorized');
    }

    client.setSession(session.value);

    return {
      get account() {
        return new Account(client);
      },
      get tables() {
        return new TablesDB(client);
      },
    };
  } catch {
    return null;
  }
}

export async function createAdminClient() {
  const client = new Client().setEndpoint(endpoint!).setProject(project!).setKey(apiKey!);

  return {
    get account() {
      return new Account(client);
    },
    get users() {
      return new Users(client);
    },
  };
}
