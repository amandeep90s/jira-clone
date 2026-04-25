import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { ID, Permission, Role } from 'node-appwrite';

import { DATABASE_ID, WORKSPACES_TABLE_ID } from '@/config';
import { sessionMiddleware } from '@/middlewares/session-middleware';

import { createWorkspaceSchema } from '../schemas';

const app = new Hono().post('/', zValidator('json', createWorkspaceSchema), sessionMiddleware, async (c) => {
  const tablesDB = c.get('tablesDB');
  const user = c.get('user');

  const { name } = c.req.valid('json');

  const workspace = await tablesDB.createRow({
    databaseId: DATABASE_ID,
    tableId: WORKSPACES_TABLE_ID,
    rowId: ID.unique(),
    data: { name, userId: user.$id },
    permissions: [
      Permission.read(Role.user(user.$id)),
      Permission.update(Role.user(user.$id)),
      Permission.delete(Role.user(user.$id)),
    ],
  });

  return c.json({ data: workspace });
});

export default app;
