'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { SignUpFormData, signUpSchema } from '@/features/auth/schemas';

import { useSignUp } from '../api/use-sign-up';

export const SignUpCard = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { mutate, isPending } = useSignUp();

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: 'onSubmit',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  function onSubmit(data: SignUpFormData) {
    mutate(
      { json: data },
      {
        onSuccess: () => {
          form.reset();
          toast.success('Successfully signed up!');
        },
        onError: () => toast.error('Failed to sign up. Please check your details and try again.'),
      },
    );
  }

  return (
    <Card className="h-full w-full md:w-md">
      <CardHeader className="flex flex-col items-center justify-center text-center">
        <CardTitle className="text-2xl font-semibold">Create an Account</CardTitle>
        <CardDescription>
          By sigining up, you agree to our{' '}
          <Link href="/terms" className="text-primary hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
          .
        </CardDescription>
      </CardHeader>

      <div className="px-7">
        <Separator />
      </div>

      <CardContent className="px-7">
        <form id="sign-up-form" className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <Input
                    {...field}
                    type="text"
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your name"
                    autoComplete="off"
                    disabled={form.formState.isSubmitting || isPending}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    {...field}
                    type="email"
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your email"
                    autoComplete="off"
                    disabled={form.formState.isSubmitting || isPending}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      type={showPassword ? 'text' : 'password'}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter your password"
                      autoComplete="off"
                      disabled={form.formState.isSubmitting || isPending}
                    />
                    <InputGroupAddon align="inline-end">
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="text-muted-foreground hover:text-foreground focus:outline-none"
                      >
                        {showPassword ? <EyeIcon size={16} /> : <EyeOffIcon size={16} />}
                      </button>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      type={showConfirmPassword ? 'text' : 'password'}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="Confirm your password"
                      autoComplete="off"
                      disabled={form.formState.isSubmitting || isPending}
                    />
                    <InputGroupAddon align="inline-end">
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                        className="text-muted-foreground hover:text-foreground focus:outline-none"
                      >
                        {showConfirmPassword ? <EyeIcon size={16} /> : <EyeOffIcon size={16} />}
                      </button>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="flex-col">
        <Field orientation="responsive">
          <Button type="submit" form="sign-up-form" disabled={form.formState.isSubmitting || isPending}>
            {form.formState.isSubmitting && <Spinner data-icon="inline-start" />}

            {form.formState.isSubmitting ? 'Signing Up...' : 'Sign Up'}
          </Button>

          <Separator className="my-3" />

          <Button variant={'outline'}>
            <Image src="/google.svg" alt="Google logo" width={20} height={20} />
            Sign Up with Google
          </Button>
          <Button variant={'outline'}>
            <Image src="/github.svg" alt="GitHub logo" width={20} height={20} />
            Sign Up with GitHub
          </Button>
        </Field>

        <p className="mt-5">
          Already have an account?{' '}
          <Link href="/sign-in" className="text-primary hover:underline">
            Sign In
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};
