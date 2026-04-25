'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { CreateWorkspaceFormData, createWorkspaceSchema } from '@/features/workspaces/schemas';

import { useCreateWorkspace } from '../api/use-create-workspace';

interface CreateWorkspaceFormProps {
  onCancel?: () => void;
}

export const CreateWorkspaceForm = ({ onCancel }: CreateWorkspaceFormProps) => {
  const { mutate, isPending } = useCreateWorkspace();

  const form = useForm<CreateWorkspaceFormData>({
    resolver: zodResolver(createWorkspaceSchema),
    mode: 'onSubmit',
    defaultValues: {
      name: '',
    },
  });

  function onSubmit(formData: CreateWorkspaceFormData) {
    mutate(
      {
        json: formData,
      },
      {
        onSuccess: () => {
          form.reset();
          toast.success('Workspace created successfully!');
        },
        onError: () => toast.error('Failed to create workspace. Please try again.'),
      },
    );
  }

  function handleCancel() {
    form.reset();
    if (onCancel) {
      onCancel();
    }
  }

  return (
    <Card className="h-full w-full">
      <CardHeader className="flex">
        <CardTitle className="text-xl font-bold">Create a new workspace</CardTitle>
      </CardHeader>

      <div className="px-6">
        <Separator />
      </div>

      <CardContent className="px-6">
        <form id="create-workspace-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Workspace Name</FieldLabel>
                  <Input
                    {...field}
                    type="text"
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter workspace name"
                    autoComplete="off"
                    disabled={form.formState.isSubmitting || isPending}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="flex-col">
        <Field orientation="horizontal" className="justify-end gap-2">
          <Button type="submit" form="create-workspace-form" disabled={form.formState.isSubmitting || isPending}>
            {form.formState.isSubmitting && <Spinner data-icon="inline-start" />}

            {form.formState.isSubmitting ? 'Creating...' : 'Create Workspace'}
          </Button>

          <Button
            type="button"
            variant={'outline'}
            onClick={handleCancel}
            disabled={form.formState.isSubmitting || isPending}
          >
            Cancel
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
};
