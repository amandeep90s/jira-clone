import { z } from 'zod';

export const createWorkspaceSchema = z.object({
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

// Export the inferred TypeScript type for the create workspace data
export type CreateWorkspaceFormData = z.infer<typeof createWorkspaceSchema>;
