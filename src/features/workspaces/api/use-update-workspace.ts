'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferResponseType } from 'hono';

import { client } from '@/lib/rpc';

import { UpdateWorkspaceFormData } from '../schemas';

type ResponseType = InferResponseType<(typeof client.api.workspaces)[':workspaceId']['$patch'], 200>;

interface Variables extends UpdateWorkspaceFormData {
  workspaceId: string;
}

export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, Variables>({
    mutationFn: async ({ workspaceId, ...data }) => {
      const response = await client.api.workspaces[':workspaceId'].$patch({
        param: { workspaceId },
        form: {
          name: data.name,
          ...(data.image instanceof File ? { image: data.image } : {}),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
      });

      if (!response.ok) {
        throw new Error('Failed to update workspace. Please try again.');
      }

      return response.json();
    },
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      queryClient.invalidateQueries({ queryKey: ['workspace', data.$id] });
    },
  });

  return mutation;
};
