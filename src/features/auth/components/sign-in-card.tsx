import { zodResolver } from '@hookform/resolvers/zod';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { useSignIn } from '@/features/auth/api/use-sign-in';
import { type SignInFormData, signInSchema } from '@/features/auth/schemas';

export const SignInCard = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { mutate, isPending } = useSignIn();

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: 'onSubmit',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(formData: SignInFormData) {
    mutate(
      { json: formData },
      {
        onSuccess: () => {
          form.reset();
          router.replace('/');
          toast.success('Successfully signed in!');
        },
        onError: () => toast.error('Failed to sign in. Please check your credentials and try again.'),
      },
    );
  }

  return (
    <Card className="h-full w-full md:w-md">
      <CardHeader className="flex items-center justify-center">
        <CardTitle className="text-2xl font-semibold">Welcome Back!</CardTitle>
      </CardHeader>

      <div className="px-7">
        <Separator />
      </div>

      <CardContent className="px-7">
        <form id="sign-in-form" className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
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
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="flex-col">
        <Field orientation="responsive">
          <Button type="submit" form="sign-in-form" disabled={form.formState.isSubmitting || isPending}>
            {form.formState.isSubmitting && <Spinner data-icon="inline-start" />}

            {form.formState.isSubmitting ? 'Signing In...' : 'Sign In'}
          </Button>

          <Separator className="my-3" />

          <Button variant={'outline'}>
            <Image src="/google.svg" alt="Google logo" width={20} height={20} />
            Sign In with Google
          </Button>
          <Button variant={'outline'}>
            <Image src="/github.svg" alt="GitHub logo" width={20} height={20} />
            Sign In with GitHub
          </Button>
        </Field>

        <p className="mt-5">
          Don&apos;t have an account?{' '}
          <Link href="/sign-up" className="text-primary hover:underline">
            Sign Up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};
