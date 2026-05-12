import { z } from 'zod';

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Workspace name is required')
    .max(255, 'Workspace name must be at most 255 characters'),
  image: z
    .union([
      z.instanceof(File).refine((file) => file.size <= 1024 * 1024, 'Image size must be at most 1MB'),
      z.string().transform((value) => (value.trim() === '' ? undefined : value)),
    ])
    .optional(),
});

export const createWorkspaceSchema = schema;

export const updateWorkspaceSchema = schema.partial();

export const workspaceJoinCodeSchema = z.object({
  inviteCode: z.string().trim().min(1, 'Invite code is required'),
});

// Export the inferred TypeScript type for the create workspace data
export type CreateWorkspaceFormData = z.infer<typeof createWorkspaceSchema>;
export type UpdateWorkspaceFormData = z.infer<typeof updateWorkspaceSchema>;
export type WorkspaceJoinCodeData = z.infer<typeof workspaceJoinCodeSchema>;
