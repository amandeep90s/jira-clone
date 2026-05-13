'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferResponseType } from 'hono';

import { CreateProjectSchema } from '@/features/projects/schemas';
import { client } from '@/lib/rpc';

type ResponseType = InferResponseType<typeof client.api.projects.$post>;

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, CreateProjectSchema>({
    mutationFn: async (data) => {
      const response = await client.api.projects.$post({
        form: {
          name: data.name,
          workspaceId: data.workspaceId,
          ...(data.image instanceof File ? { image: data.image } : {}),
        } as CreateProjectSchema,
      });

      if (!response.ok) {
        const errorData = (await response.json()) as { error?: string };
        throw new Error(errorData.error ?? 'Failed to create project. Please try again.');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  return mutation;
};
