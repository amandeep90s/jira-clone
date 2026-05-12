import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { Query } from 'node-appwrite';

import { ARRWRITE_DATABASE_ID, ARRWRITE_MEMBERS_TABLE_ID } from '@/config';
import { getMembersSchema, updateMemberRoleSchema } from '@/features/members/schemas';
import { getMember } from '@/features/members/utils';
import { createAdminClient } from '@/lib/appwrite';
import { sessionMiddleware } from '@/middlewares/session-middleware';

import { MemberRole } from '../types';

const app = new Hono()
  .get('/', sessionMiddleware, zValidator('query', getMembersSchema), async (c) => {
    const { users } = await createAdminClient();
    const tablesDB = c.get('tablesDB');
    const user = c.get('user');
    const { workspaceId } = c.req.valid('query');

    const member = await getMember({ tablesDB, userId: user.$id, workspaceId });

    if (!member) {
      return c.json({ error: 'Member not found' }, 404);
    }

    const members = await tablesDB.listRows({
      databaseId: ARRWRITE_DATABASE_ID,
      tableId: ARRWRITE_MEMBERS_TABLE_ID,
      queries: [Query.equal('workspaceId', workspaceId)],
    });

    const populateMembers = await Promise.all(
      members.rows.map(async (member) => {
        const user = await users.get(member.userId);

        return {
          ...member,
          name: user.name,
          email: user.email,
        };
      }),
    );

    return c.json({
      data: {
        ...members,
        documents: populateMembers,
      },
    });
  })
  .delete('/:memberId', sessionMiddleware, async (c) => {
    const { memberId } = c.req.param();
    const tablesDB = c.get('tablesDB');
    const user = c.get('user');

    const memberToDelete = await tablesDB.getRow({
      databaseId: ARRWRITE_DATABASE_ID,
      tableId: ARRWRITE_MEMBERS_TABLE_ID,
      rowId: memberId,
    });

    if (!memberToDelete) {
      return c.json({ error: 'Member not found' }, 404);
    }

    const allMembersInWorkspace = await tablesDB.listRows({
      databaseId: ARRWRITE_DATABASE_ID,
      tableId: ARRWRITE_MEMBERS_TABLE_ID,
      queries: [Query.equal('workspaceId', memberToDelete.workspaceId)],
    });

    if (allMembersInWorkspace.total === 1) {
      return c.json({ error: 'Cannot remove the only member in the workspace' }, 400);
    }

    const member = await getMember({ tablesDB, userId: user.$id, workspaceId: memberToDelete.workspaceId });

    if (!member) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    if (memberToDelete.$id !== member.$id && member.role !== MemberRole.ADMIN) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    await tablesDB.deleteRow({
      databaseId: ARRWRITE_DATABASE_ID,
      tableId: ARRWRITE_MEMBERS_TABLE_ID,
      rowId: memberId,
    });

    return c.json({ data: { $id: memberToDelete.$id }, message: 'Member removed successfully' });
  })
  .patch('/:memberId', sessionMiddleware, zValidator('json', updateMemberRoleSchema), async (c) => {
    const { memberId } = c.req.param();
    const tablesDB = c.get('tablesDB');
    const user = c.get('user');
    const { role } = c.req.valid('json');

    const memberToUpdate = await tablesDB.getRow({
      databaseId: ARRWRITE_DATABASE_ID,
      tableId: ARRWRITE_MEMBERS_TABLE_ID,
      rowId: memberId,
    });

    if (!memberToUpdate) {
      return c.json({ error: 'Member not found' }, 404);
    }

    const allMembersInWorkspace = await tablesDB.listRows({
      databaseId: ARRWRITE_DATABASE_ID,
      tableId: ARRWRITE_MEMBERS_TABLE_ID,
      queries: [Query.equal('workspaceId', memberToUpdate.workspaceId)],
    });

    if (allMembersInWorkspace.total === 1) {
      return c.json({ error: 'Cannot update the only member in the workspace' }, 400);
    }

    const member = await getMember({ tablesDB, userId: user.$id, workspaceId: memberToUpdate.workspaceId });

    if (!member) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    if (member.role !== MemberRole.ADMIN) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    await tablesDB.updateRow({
      databaseId: ARRWRITE_DATABASE_ID,
      tableId: ARRWRITE_MEMBERS_TABLE_ID,
      rowId: memberId,
      data: { role },
    });

    return c.json({ data: { $id: memberToUpdate.$id }, message: 'Member updated successfully' });
  });

export default app;
