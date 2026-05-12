import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { Query } from 'node-appwrite';

import { APPWRITE_DATABASE_ID, APPWRITE_PROJECTS_TABLE_ID } from '@/config';
import { getMember } from '@/features/members/utils';
import { getProjectsSchema } from '@/features/projects/schemas';
import { sessionMiddleware } from '@/middlewares/session-middleware';

const app = new Hono().get('/', sessionMiddleware, zValidator('query', getProjectsSchema), async (c) => {
  const user = c.get('user');
  const tablesDB = c.get('tablesDB');

  const { workspaceId } = c.req.valid('query');

  const member = await getMember({ tablesDB, userId: user.$id, workspaceId });

  if (!member) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const projects = await tablesDB.listRows({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: APPWRITE_PROJECTS_TABLE_ID,
    queries: [Query.equal('workspaceId', workspaceId), Query.orderDesc('$createdAt')],
  });

  return c.json({ data: projects });
});

export default app;
