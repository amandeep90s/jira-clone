'use client';

import { useMutation } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';

import { client } from '@/lib/rpc';

type ResponseType = InferResponseType<(typeof client.api.auth)['sign-in']['$post']>;

type RequestType = InferRequestType<(typeof client.api.auth)['sign-in']['$post']>;

/**
 * Custom hook to handle user sign-in using React Query's useMutation.
 * It sends a POST request to the sign-in endpoint and returns the response.
 * @returns An object containing the mutation function and its state (loading, error, data).
 */
export const useSignIn = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth['sign-in'].$post({ json });

      if (!response.ok) {
        throw new Error('Failed to sign in. Please try again.');
      }

      return response.json();
    },
  });

  return mutation;
};
