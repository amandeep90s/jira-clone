'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';

import { client } from '@/lib/rpc';

type ResponseType = InferResponseType<typeof client.api.workspaces.$post>;

type RequestType = InferRequestType<typeof client.api.workspaces.$post>;

/**
 * Custom hook to handle workspace creation using React Query's useMutation.
 * It sends a POST request to the workspace creation endpoint and returns the response.
 * @returns An object containing the mutation function and its state (loading, error, data).
 * On successful workspace creation, it invalidates the 'workspaces' query to refresh the workspace list.
 */
export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.workspaces.$post({ json });

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
