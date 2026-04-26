'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
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
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);

  // Revoke the blob URL whenever the preview URL changes or on unmount
  useEffect(() => {
    return () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    };
  }, [imagePreviewUrl]);

  const form = useForm<CreateWorkspaceFormData>({
    resolver: zodResolver(createWorkspaceSchema),
    mode: 'onSubmit',
    defaultValues: {
      name: '',
    },
  });

  function resetImageInput() {
    setImagePreviewUrl(null);
    setFileInputKey((k) => k + 1);
  }

  const onSubmit = useCallback(
    (formData: CreateWorkspaceFormData) => {
      mutate(formData, {
        onSuccess: () => {
          form.reset();
          resetImageInput();
          toast.success('Workspace created successfully!');
        },
        onError: () => toast.error('Failed to create workspace. Please try again.'),
      });
    },
    [form, mutate],
  );

  function handleCancel() {
    form.reset();
    resetImageInput();
    if (onCancel) {
      onCancel();
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreviewUrl(URL.createObjectURL(file));
      form.setValue('image', file, { shouldDirty: true });
    } else {
      setImagePreviewUrl(null);
      form.setValue('image', undefined, { shouldDirty: true });
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
          <FieldGroup className="">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    Workspace Name <span className="text-destructive">*</span>
                  </FieldLabel>
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

            <Controller
              name="image"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Workspace Image</FieldLabel>
                  <Input
                    key={fileInputKey}
                    name={field.name}
                    onBlur={field.onBlur}
                    disabled={form.formState.isSubmitting || isPending}
                    accept="image/jpeg,image/png,image/svg+xml"
                    id="image"
                    type="file"
                    onChange={handleImageChange}
                  />
                  <FieldDescription>
                    Upload an image to represent your workspace. Supported formats: JPG, PNG, SVG or JPEG. Max size:
                    1MB.
                  </FieldDescription>

                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}

                  {imagePreviewUrl ? (
                    <div className="w-fit">
                      <div className="relative size-18 overflow-hidden rounded-md">
                        <Image src={imagePreviewUrl} alt="Workspace Image" fill className="object-cover" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-fit">
                      <Avatar className="size-18 flex-0 overflow-hidden rounded-md">
                        <AvatarFallback>
                          <ImageIcon className="size-9 text-neutral-400 dark:text-neutral-200" />
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  )}
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
