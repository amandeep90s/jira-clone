'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferResponseType } from 'hono';

import { client } from '@/lib/rpc';

import { UpdateWorkspaceFormData } from '../schemas';

type ResponseType = InferResponseType<(typeof client.api.workspaces)[':workspaceId']['$patch'], 200>;

interface Variables {
  workspaceId: string;
  form: UpdateWorkspaceFormData;
}

export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, Variables>({
    mutationFn: async ({ workspaceId, form }) => {
      const response = await client.api.workspaces[':workspaceId'].$patch({
        param: { workspaceId },
        form: {
          name: form.name,
          ...(form.image instanceof File ? { image: form.image } : {}),
        } as UpdateWorkspaceFormData,
      });

      if (!response.ok) {
        const errorData = (await response.json()) as { error?: string };
        throw new Error(errorData.error ?? 'Failed to update workspace. Please try again.');
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
