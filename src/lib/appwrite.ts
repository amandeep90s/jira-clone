import 'server-only';

import { Account, Client } from 'node-appwrite';

import { APPWRITE_ENDPOINT, APPWRITE_KEY, APPWRITE_PROJECT } from '@/config';

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

export async function createAdminClient() {
  const client = new Client().setEndpoint(endpoint!).setProject(project!).setKey(apiKey!);

  return {
    get account() {
      return new Account(client);
    },
  };
}
