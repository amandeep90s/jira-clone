import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { ID, Permission, Role } from 'node-appwrite';

import { DATABASE_ID, STORAGE_BUCKET_ID, WORKSPACES_TABLE_ID } from '@/config';
import { sessionMiddleware } from '@/middlewares/session-middleware';

import { createWorkspaceSchema } from '../schemas';

const app = new Hono().post('/', zValidator('json', createWorkspaceSchema), sessionMiddleware, async (c) => {
  const tablesDB = c.get('tablesDB');
  const user = c.get('user');
  const storage = c.get('storage');

  const { name, image } = c.req.valid('json');

  let uploadedImageUrl: string | undefined;

  if (image instanceof File) {
    const file = await storage.createFile({ bucketId: STORAGE_BUCKET_ID, fileId: ID.unique(), file: image });

    const arrayBuffer = await storage.getFilePreview({ bucketId: STORAGE_BUCKET_ID, fileId: file.$id });

    uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString('base64')}`;
  }

  const workspace = await tablesDB.createRow({
    databaseId: DATABASE_ID,
    tableId: WORKSPACES_TABLE_ID,
    rowId: ID.unique(),
    data: { name, userId: user.$id, imageUrl: uploadedImageUrl },
    permissions: [
      Permission.read(Role.user(user.$id)),
      Permission.update(Role.user(user.$id)),
      Permission.delete(Role.user(user.$id)),
    ],
  });

  return c.json({ data: workspace });
});

export default app;
