import { useMutation } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';

import { client } from '@/lib/rpc';

type ResponseType = InferResponseType<(typeof client.api.auth)['sign-up']['$post']>;

type RequestType = InferRequestType<(typeof client.api.auth)['sign-up']['$post']>;

/**
 * Custom hook to handle user sign-up using React Query's useMutation.
 * It sends a POST request to the sign-up endpoint and returns the response.
 * @returns An object containing the mutation function and its state (loading, error, data).
 */
export const useSignUp = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth['sign-up'].$post({ json });
      return response.json();
    },
  });

  return mutation;
};
