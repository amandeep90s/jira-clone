import { z } from 'zod';

export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Workspace name is required')
    .max(255, 'Workspace name must be at most 255 characters'),
});

// Export the inferred TypeScript type for the create workspace data
export type CreateWorkspaceFormData = z.infer<typeof createWorkspaceSchema>;
