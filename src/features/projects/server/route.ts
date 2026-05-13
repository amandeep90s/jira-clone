import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { ID, Query } from 'node-appwrite';

import { APPWRITE_DATABASE_ID, APPWRITE_PROJECTS_TABLE_ID, STORAGE_BUCKET_ID } from '@/config';
import { getMember } from '@/features/members/utils';
import { createProjectFormSchema, getProjectsSchema } from '@/features/projects/schemas';
import { sessionMiddleware } from '@/middlewares/session-middleware';

const app = new Hono()
  .get('/', sessionMiddleware, zValidator('query', getProjectsSchema), async (c) => {
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
  })
  .post('/', sessionMiddleware, zValidator('form', createProjectFormSchema), async (c) => {
    const tablesDB = c.get('tablesDB');
    const user = c.get('user');
    const storage = c.get('storage');

    const { name, image, workspaceId } = c.req.valid('form');

    const member = await getMember({ tablesDB, userId: user.$id, workspaceId });

    if (!member) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    let uploadedImageUrl: string | undefined;

    if (image instanceof File) {
      const file = await storage.createFile({ bucketId: STORAGE_BUCKET_ID, fileId: ID.unique(), file: image });

      const arrayBuffer = await storage.getFileDownload({ bucketId: STORAGE_BUCKET_ID, fileId: file.$id });

      uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString('base64')}`;
    }

    const project = await tablesDB.createRow({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: APPWRITE_PROJECTS_TABLE_ID,
      rowId: ID.unique(),
      data: { name, imageUrl: uploadedImageUrl, workspaceId },
    });

    return c.json({ data: project });
  });

export default app;
