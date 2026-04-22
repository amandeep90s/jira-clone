import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';

import { signInSchema } from '@/features/auth/schemas';

const app = new Hono().post('/sign-in', zValidator('json', signInSchema), (c) => {
  return c.json({ message: 'Sign in successful' });
});

export default app;
