import { z } from 'zod';

export const getMembersSchema = z.object({
  workspaceId: z.string(),
});

export const updateMemberRoleSchema = z.object({
  role: z.enum(['ADMIN', 'MEMBER']),
});

export type GetMembersParams = z.infer<typeof getMembersSchema>;
export type UpdateMemberRoleParams = z.infer<typeof updateMemberRoleSchema>;
