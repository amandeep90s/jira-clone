import 'server-only';

import { Account, Client } from 'node-appwrite';

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT;
const apiKey = process.env.NEXT_APPWRITE_KEY;

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
