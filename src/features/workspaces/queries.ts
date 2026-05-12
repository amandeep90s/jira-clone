import 'server-only';

import { Query } from 'node-appwrite';

import { DATABASE_ID, MEMBERS_TABLE_ID, WORKSPACES_TABLE_ID } from '@/config';
import { getMember } from '@/features/members/utils';
import { Workspace } from '@/features/workspaces/types';
import { createSessionClient } from '@/lib/appwrite';

/**
 * Get the currently authenticated user.
 * @returns The authenticated user, or null if not authenticated or if fetching the user information fails.
 */
export const getWorkspaces = async () => {
  const emptyResponse = { total: 0, rows: [] };

  try {
    const session = await createSessionClient();
    if (!session) return null;

    const tablesDB = session.tables;
    const user = await session.account.get();

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

interface GetWorkspaceProps {
  workspaceId: string;
}

/**
 * Get a workspace by its ID, ensuring that the currently authenticated user is a member of that workspace.
 * @param param0 An object containing the workspaceId.
 * @returns The workspace if the user is a member, or an empty response if not.
 */
export const getWorkspace = async ({ workspaceId }: GetWorkspaceProps): Promise<Workspace | null> => {
  const emptyResponse = null;

  try {
    const session = await createSessionClient();
    if (!session) return null;

    const tablesDB = session.tables;
    const user = await session.account.get();

    const member = await getMember({ tablesDB, userId: user.$id, workspaceId });

    if (!member) {
      return emptyResponse;
    }

    const workspace = await tablesDB.listRows({
      databaseId: DATABASE_ID,
      tableId: WORKSPACES_TABLE_ID,
      queries: [Query.equal('$id', workspaceId)],
    });

    return JSON.parse(JSON.stringify(workspace.rows[0])) as Workspace;
  } catch {
    return emptyResponse;
  }
};

interface GetWorkspaceInfoProps {
  workspaceId: string;
}

/**
 * Get a workspace by its ID, ensuring that the currently authenticated user is a member of that workspace.
 * @param param0 An object containing the workspaceId.
 * @returns The workspace if the user is a member, or an empty response if not.
 */
export const getWorkspaceInfo = async ({ workspaceId }: GetWorkspaceInfoProps): Promise<{ name: string } | null> => {
  const emptyResponse = null;

  try {
    const session = await createSessionClient();
    if (!session) return null;

    const tablesDB = session.tables;

    const workspace = await tablesDB.getRow({
      databaseId: DATABASE_ID,
      tableId: WORKSPACES_TABLE_ID,
      rowId: workspaceId,
    });

    return { name: workspace.name };
  } catch {
    return emptyResponse;
  }
};
