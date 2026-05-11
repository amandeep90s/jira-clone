import 'server-only';

import { createSessionClient } from '@/lib/appwrite';

/**
 * Get the currently authenticated user.
 * @returns The authenticated user, or null if not authenticated or if fetching the user information fails.
 */
export const getUser = async () => {
  try {
    const session = await createSessionClient();
    if (!session) return null;

    return await session.account.get();
  } catch {
    return null;
  }
};
