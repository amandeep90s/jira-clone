import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { ID, Permission, Query, Role } from 'node-appwrite';

import {
  ARRWRITE_DATABASE_ID,
  ARRWRITE_MEMBERS_TABLE_ID,
  ARRWRITE_WORKSPACES_TABLE_ID,
  STORAGE_BUCKET_ID,
} from '@/config';
import { MemberRole } from '@/features/members/types';
import { getMember } from '@/features/members/utils';
import { createWorkspaceSchema, updateWorkspaceSchema, workspaceJoinCodeSchema } from '@/features/workspaces/schemas';
import { generateInviteCode } from '@/lib/utils';
import { sessionMiddleware } from '@/middlewares/session-middleware';

const app = new Hono()
  .get('/', sessionMiddleware, async (c) => {
    const user = c.get('user');
    const tablesDB = c.get('tablesDB');

    const members = await tablesDB.listRows({
      databaseId: ARRWRITE_DATABASE_ID,
      tableId: ARRWRITE_MEMBERS_TABLE_ID,
      queries: [Query.equal('userId', user.$id)],
    });

    if (members.total === 0) {
      return c.json({ data: { total: 0, rows: [] } });
    }

    const workspaceIds = members.rows.map((member) => member.workspaceId);

    const workspaces = await tablesDB.listRows({
      databaseId: ARRWRITE_DATABASE_ID,
      tableId: ARRWRITE_WORKSPACES_TABLE_ID,
      queries: [Query.contains('$id', workspaceIds), Query.orderDesc('$createdAt')],
    });

    return c.json({ data: workspaces });
  })
  .post('/', zValidator('form', createWorkspaceSchema), sessionMiddleware, async (c) => {
    const tablesDB = c.get('tablesDB');
    const user = c.get('user');
    const storage = c.get('storage');

    const { name, image } = c.req.valid('form');

    let uploadedImageUrl: string | undefined;

    if (image instanceof File) {
      const file = await storage.createFile({ bucketId: STORAGE_BUCKET_ID, fileId: ID.unique(), file: image });

      const arrayBuffer = await storage.getFileDownload({ bucketId: STORAGE_BUCKET_ID, fileId: file.$id });

      uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString('base64')}`;
    }

    const inviteCode = generateInviteCode();

    const workspace = await tablesDB.createRow({
      databaseId: ARRWRITE_DATABASE_ID,
      tableId: ARRWRITE_WORKSPACES_TABLE_ID,
      rowId: ID.unique(),
      data: { name, userId: user.$id, imageUrl: uploadedImageUrl, inviteCode },
      permissions: [
        Permission.read(Role.user(user.$id)),
        Permission.update(Role.user(user.$id)),
        Permission.delete(Role.user(user.$id)),
      ],
    });

    await tablesDB.createRow({
      databaseId: ARRWRITE_DATABASE_ID,
      tableId: ARRWRITE_MEMBERS_TABLE_ID,
      rowId: ID.unique(),
      data: { workspaceId: workspace.$id, userId: user.$id, role: MemberRole.ADMIN },
    });

    return c.json({ data: workspace });
  })
  .patch('/:workspaceId', zValidator('form', updateWorkspaceSchema), sessionMiddleware, async (c) => {
    const tablesDB = c.get('tablesDB');
    const user = c.get('user');
    const storage = c.get('storage');

    const { workspaceId } = c.req.param();
    const { name, image } = c.req.valid('form');

    const member = await getMember({ tablesDB, userId: user.$id, workspaceId });

    if (!member) {
      return c.json({ error: 'Workspace not found' }, 404);
    }

    if (member.role !== MemberRole.ADMIN) {
      return c.json({ error: 'Only admins can update the workspace' }, 403);
    }

    let uploadedImageUrl: string | undefined;

    if (image instanceof File) {
      const file = await storage.createFile({ bucketId: STORAGE_BUCKET_ID, fileId: ID.unique(), file: image });

      const arrayBuffer = await storage.getFileDownload({ bucketId: STORAGE_BUCKET_ID, fileId: file.$id });

      uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString('base64')}`;
    } else {
      uploadedImageUrl = image;
    }

    const updatedWorkspace = await tablesDB.updateRow({
      databaseId: ARRWRITE_DATABASE_ID,
      tableId: ARRWRITE_WORKSPACES_TABLE_ID,
      rowId: workspaceId,
      data: { name, imageUrl: uploadedImageUrl },
    });

    return c.json({ data: updatedWorkspace });
  })
  .delete('/:workspaceId', sessionMiddleware, async (c) => {
    const tablesDB = c.get('tablesDB');
    const user = c.get('user');

    const { workspaceId } = c.req.param();

    const member = await getMember({ tablesDB, userId: user.$id, workspaceId });

    if (!member) {
      return c.json({ error: 'Workspace not found' }, 404);
    }

    if (member.role !== MemberRole.ADMIN) {
      return c.json({ error: 'Only admins can delete the workspace' }, 403);
    }

    // TODO: Delete members, projects and tasks related to this workspace

    await tablesDB.deleteRow({
      databaseId: ARRWRITE_DATABASE_ID,
      tableId: ARRWRITE_WORKSPACES_TABLE_ID,
      rowId: workspaceId,
    });

    return c.json({ data: { $id: workspaceId, message: 'Workspace deleted successfully' } });
  })
  .post('/:workspaceId/reset-invite-code', sessionMiddleware, async (c) => {
    const tablesDB = c.get('tablesDB');
    const user = c.get('user');

    const { workspaceId } = c.req.param();

    const member = await getMember({ tablesDB, userId: user.$id, workspaceId });

    if (!member) {
      return c.json({ error: 'Workspace not found' }, 404);
    }

    if (member.role !== MemberRole.ADMIN) {
      return c.json({ error: 'Only admins can reset the invite code' }, 403);
    }

    const workspace = await tablesDB.updateRow({
      databaseId: ARRWRITE_DATABASE_ID,
      tableId: ARRWRITE_WORKSPACES_TABLE_ID,
      rowId: workspaceId,
      data: { inviteCode: generateInviteCode() },
    });

    return c.json({ data: workspace, message: 'Workspace invite code reset successfully' });
  })
  .post('/:workspaceId/join', zValidator('json', workspaceJoinCodeSchema), sessionMiddleware, async (c) => {
    const tablesDB = c.get('tablesDB');
    const user = c.get('user');

    const { workspaceId } = c.req.param();
    const { inviteCode } = c.req.valid('json');

    const existingMember = await getMember({ tablesDB, userId: user.$id, workspaceId });

    if (existingMember) {
      return c.json({ error: 'User is already a member of this workspace' }, 400);
    }

    const workspace = await tablesDB.getRow({
      databaseId: ARRWRITE_DATABASE_ID,
      tableId: ARRWRITE_WORKSPACES_TABLE_ID,
      rowId: workspaceId,
    });

    if (!workspace) {
      return c.json({ error: 'Workspace not found' }, 404);
    }

    if (workspace.inviteCode !== inviteCode) {
      return c.json({ error: 'Invalid invite code' }, 400);
    }

    await tablesDB.createRow({
      databaseId: ARRWRITE_DATABASE_ID,
      tableId: ARRWRITE_MEMBERS_TABLE_ID,
      rowId: ID.unique(),
      data: { workspaceId, userId: user.$id, role: MemberRole.MEMBER },
    });

    return c.json({ data: workspace, message: 'Joined workspace successfully' });
  });

export default app;
