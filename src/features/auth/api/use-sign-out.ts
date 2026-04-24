'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferResponseType } from 'hono';
import { useRouter } from 'next/navigation';

import { client } from '@/lib/rpc';

type ResponseType = InferResponseType<(typeof client.api.auth)['sign-out']['$post']>;

/**
 * Custom hook to handle user sign-out using React Query's useMutation.
 * It sends a POST request to the sign-out endpoint and returns the response.
 * @returns An object containing the mutation function and its state (loading, error, data).
 */
export const useSignOut = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.auth['sign-out'].$post();
      return response.json();
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['current-user'] });
      router.refresh();
    },
  });

  return mutation;
};
