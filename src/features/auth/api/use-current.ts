'use client';

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { InferResponseType } from 'hono';

import { client } from '@/lib/rpc';

type ResponseType = InferResponseType<(typeof client.api.auth)['me']['$get']>;

/**
 * Custom hook to fetch the current authenticated user's information using React Query's useQuery.
 * It sends a GET request to the /me endpoint and returns the user's data.
 * @returns An object containing the query result, including the user's data, loading state, and any errors.
 */
export const useCurrent = (): UseQueryResult<ResponseType['user'] | null> => {
  const query = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const response = await client.api.auth.me.$get();

      if (!response.ok) {
        return null;
      }

      const { user } = await response.json();

      return user;
    },
  });

  return query;
};
