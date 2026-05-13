import { z } from 'zod';

export const getProjectsSchema = z.object({
  workspaceId: z.string().min(1, 'Workspace ID is required'),
});

export const createProjectFormSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(255, 'Project name must be less than 255 characters'),
  image: z
    .union([
      z.instanceof(File).refine((file) => file.size <= 1024 * 1024, 'Image size must be at most 1MB'),
      z.string().transform((value) => (value.trim() === '' ? undefined : value)),
    ])
    .optional(),
  workspaceId: z.string().min(1, 'Workspace ID is required'),
});

export type GetProjectsSchema = z.infer<typeof getProjectsSchema>;
export type CreateProjectFormSchema = z.infer<typeof createProjectFormSchema>;
