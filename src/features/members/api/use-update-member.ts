'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferResponseType } from 'hono';

import { client } from '@/lib/rpc';

import { UpdateMemberRoleParams } from '../schemas';

type ResponseType = InferResponseType<(typeof client.api.members)[':memberId']['$patch'], 200>;

interface Variables {
  memberId: string;
  form: UpdateMemberRoleParams;
}

export const useUpdateMember = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, Variables>({
    mutationFn: async ({ memberId, form }) => {
      const response = await client.api.members[':memberId'].$patch({
        param: { memberId },
        json: { role: form.role },
      });

      if (!response.ok) {
        const errorData = (await response.json()) as { error?: string };
        throw new Error(errorData.error ?? 'Failed to update member. Please try again.');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
  });

  return mutation;
};
