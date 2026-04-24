import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { deleteCookie, setCookie } from 'hono/cookie';
import { ID } from 'node-appwrite';

import { signInSchema, signUpSchema } from '@/features/auth/schemas';
import { createAdminClient } from '@/lib/appwrite';
import { sessionMiddleware } from '@/middlewares/session-middleware';

import { AUTH_COOKIE_NAME } from '../constants';

const app = new Hono()
  .get('/me', sessionMiddleware, async (c) => {
    const user = c.get('user');

    return c.json({ user });
  })
  .post('/sign-in', zValidator('json', signInSchema), async (c) => {
    const { email, password } = c.req.valid('json');

    const { account } = await createAdminClient();

    const session = await account.createEmailPasswordSession({ email, password });

    setCookie(c, AUTH_COOKIE_NAME, session.secret, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return c.json({ message: 'Sign in successful', success: true });
  })
  .post('/sign-up', zValidator('json', signUpSchema), async (c) => {
    const { name, email, password } = c.req.valid('json');

    const { account } = await createAdminClient();

    await account.create({
      userId: ID.unique(),
      email,
      password,
      name,
    });

    const session = await account.createEmailPasswordSession({ email, password });

    setCookie(c, AUTH_COOKIE_NAME, session.secret, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return c.json({ message: 'Sign up successful', success: true });
  })
  .post('/sign-out', sessionMiddleware, async (c) => {
    const account = c.get('account');

    deleteCookie(c, AUTH_COOKIE_NAME);

    await account.deleteSession({ sessionId: 'current' });

    return c.json({ message: 'Sign out successful', success: true });
  });

export default app;
