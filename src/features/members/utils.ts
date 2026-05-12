import { Query, TablesDB } from 'node-appwrite';

import { APPWRITE_DATABASE_ID, APPWRITE_MEMBERS_TABLE_ID } from '@/config';

interface GetMemberProps {
  tablesDB: TablesDB;
  userId: string;
  workspaceId: string;
}

/**
 * Fetches the member record for a given user and workspace.
 * An object containing the tablesDB instance, userId, and workspaceId.
 * @returns The member record if found, otherwise null.
 */
export async function getMember({ tablesDB, userId, workspaceId }: GetMemberProps) {
  const members = await tablesDB.listRows({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: APPWRITE_MEMBERS_TABLE_ID,
    queries: [Query.equal('userId', userId), Query.equal('workspaceId', workspaceId)],
  });

  if (members.total === 0) {
    return null;
  }

  return members.rows[0];
}
