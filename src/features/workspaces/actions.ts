import 'server-only';

import { cookies } from 'next/headers';
import { Account, Client, Query, TablesDB } from 'node-appwrite';

import { DATABASE_ID, MEMBERS_TABLE_ID, WORKSPACES_TABLE_ID } from '@/config';
import { AUTH_COOKIE_NAME } from '@/features/auth/constants';

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
export const getWorkspaces = async () => {
  const endpoint = getRequiredEnv('NEXT_PUBLIC_APPWRITE_ENDPOINT');
  const project = getRequiredEnv('NEXT_PUBLIC_APPWRITE_PROJECT');
  const emptyResponse = { total: 0, rows: [] };

  try {
    const client = new Client().setEndpoint(endpoint).setProject(project);
    const session = (await cookies()).get(AUTH_COOKIE_NAME);

    if (!session) {
      return emptyResponse;
    }

    client.setSession(session.value);

    const tablesDB = new TablesDB(client);
    const account = new Account(client);
    const user = await account.get();

    const members = await tablesDB.listRows({
      databaseId: DATABASE_ID,
      tableId: MEMBERS_TABLE_ID,
      queries: [Query.equal('userId', user.$id)],
    });

    if (members.total === 0) {
      return emptyResponse;
    }

    const workspaceIds = members.rows.map((member) => member.workspaceId);

    const workspaces = await tablesDB.listRows({
      databaseId: DATABASE_ID,
      tableId: WORKSPACES_TABLE_ID,
      queries: [Query.contains('$id', workspaceIds), Query.orderDesc('$createdAt')],
    });

    return workspaces;
  } catch {
    return emptyResponse;
  }
};
