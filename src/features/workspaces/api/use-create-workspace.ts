'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferResponseType } from 'hono';

import { client } from '@/lib/rpc';

import { CreateWorkspaceFormData } from '../schemas';

type ResponseType = InferResponseType<typeof client.api.workspaces.$post>;

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, CreateWorkspaceFormData>({
    mutationFn: async (data) => {
      const response = await client.api.workspaces.$post({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        form: {
          name: data.name,
          ...(data.image instanceof File ? { image: data.image } : {}),
        } as any,
      });

      if (!response.ok) {
        throw new Error('Failed to create workspace. Please try again.');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    },
  });

  return mutation;
};
