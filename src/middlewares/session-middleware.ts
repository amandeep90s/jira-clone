import 'server-only';

import { getCookie } from 'hono/cookie';
import { createMiddleware } from 'hono/factory';
import {
  Account,
  type Account as AccountType,
  Client,
  Databases,
  type Databases as DatabasesType,
  Models,
  Storage,
  type Storage as StorageType,
  type Users as UsersType,
} from 'node-appwrite';

import { AUTH_COOKIE_NAME } from '@/features/auth/constants';

type AdditionalContext = {
  Variables: {
    account: AccountType;
    databases: DatabasesType;
    storage: StorageType;
    users: UsersType;
    user: Models.User<Models.Preferences>;
  };
};

export const sessionMiddleware = createMiddleware<AdditionalContext>(async (c, next) => {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

  const session = getCookie(c, AUTH_COOKIE_NAME);

  if (!session) {
    return c.json({ message: 'Unauthorized' }, 401);
  }

  client.setSession(session);

  const account = new Account(client);
  const databases = new Databases(client);
  const storage = new Storage(client);

  let user: Models.User<Models.Preferences>;

  try {
    user = await account.get();
  } catch {
    return c.json({ message: 'Unauthorized' }, 401);
  }

  c.set('account', account as AccountType);
  c.set('databases', databases as DatabasesType);
  c.set('storage', storage as StorageType);
  c.set('user', user);

  await next();
});
