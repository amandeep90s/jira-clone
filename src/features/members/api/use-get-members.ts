import { useQuery } from '@tanstack/react-query';

import { client } from '@/lib/rpc';

interface UseGetMembersProps {
  workspaceId: string;
}

export const useGetMembers = ({ workspaceId }: UseGetMembersProps) => {
  const query = useQuery({
    queryKey: ['members', workspaceId],
    queryFn: async () => {
      const response = await client.api.members.$get({ query: { workspaceId } });

      if (!response.ok) {
        const errorData = (await response.json()) as { error?: string };
        throw new Error(errorData.error ?? 'Failed to fetch members. Please try again.');
      }

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
