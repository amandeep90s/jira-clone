import { z } from 'zod';

export const getProjectsSchema = z.object({
  workspaceId: z.string(),
});

export type GetProjectsSchema = z.infer<typeof getProjectsSchema>;
