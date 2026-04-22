import { z } from 'zod';

export const signInSchema = z.object({
  email: z
    .email({ message: 'Invalid email address' })
    .trim()
    .min(1, { message: 'Email is required' })
    .max(50, { message: 'Email must be less than 50 characters' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .max(50, { message: 'Password must be less than 50 characters' }),
});

export const signUpSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, { message: 'Name is required' })
      .max(50, { message: 'Name must be less than 50 characters' }),
    email: z
      .email({ message: 'Invalid email address' })
      .trim()
      .min(1, { message: 'Email is required' })
      .max(50, { message: 'Email must be less than 50 characters' }),
    password: z
      .string()
      .trim()
      .min(8, { message: 'Password must be at least 8 characters' })
      .max(50, { message: 'Password must be less than 50 characters' })
      .regex(/[A-Z]/, {
        message: 'Password must contain at least one uppercase letter',
      })
      .regex(/[a-z]/, {
        message: 'Password must contain at least one lowercase letter',
      })
      .regex(/[0-9]/, { message: 'Password must contain at least one number' })
      .regex(/[@$!%*?&]/, {
        message: 'Password must contain at least one special character',
      })
      .refine((value) => !/\s/.test(value), {
        message: 'Password must not contain spaces',
      }),
    confirmPassword: z.string().min(8, { message: 'Confirm Password must be at least 8 characters' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Export the inferred TypeScript type for the sign-in data
export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
