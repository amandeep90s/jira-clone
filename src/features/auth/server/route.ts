import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';

import { signInSchema, signUpSchema } from '@/features/auth/schemas';

const app = new Hono()
  .post('/sign-in', zValidator('json', signInSchema), async (c) => {
    const { email, password } = c.req.valid('json');

    console.log({ email, password });

    return c.json({ message: 'Sign in successful' });
  })
  .post('/sign-up', zValidator('json', signUpSchema), async (c) => {
    const { name, email, password } = c.req.valid('json');

    console.log({ name, email, password });

    return c.json({ message: 'Sign up successful' });
  });

export default app;
