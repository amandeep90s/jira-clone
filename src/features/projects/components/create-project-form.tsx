'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ImageIcon, Trash2Icon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
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
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { cn } from '@/lib/utils';

import { CreateProjectFormSchema, createProjectFormSchema } from '../schemas';
import { useCreateProject } from './use-create-project';

interface CreateProjectFormProps {
  onCancel?: () => void;
}

export const CreateProjectForm = ({ onCancel }: CreateProjectFormProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { mutate, isPending } = useCreateProject();
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);

  // Revoke the blob URL whenever the preview URL changes or on unmount
  useEffect(() => {
    return () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    };
  }, [imagePreviewUrl]);

  const form = useForm<CreateProjectFormSchema>({
    resolver: zodResolver(createProjectFormSchema),
    mode: 'onSubmit',
    defaultValues: {
      name: '',
    },
  });

  function resetImageInput() {
    setImagePreviewUrl(null);
    setFileInputKey((k) => k + 1);
  }

  const handleCancel = useCallback(() => {
    form.reset();
    resetImageInput();
    if (onCancel) onCancel();
  }, [onCancel, form]);

  const onSubmit = useCallback(
    (formData: CreateProjectFormSchema) => {
      mutate(
        { ...formData, workspaceId },
        {
          onSuccess: ({ data }) => {
            router.push(`/workspaces/${workspaceId}/projects/${data.$id}`);
            toast.success('Project created successfully!');
          },
          onError: (error) => toast.error(error.message),
        },
      );
    },
    [mutate, router, workspaceId],
  );

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
        <CardTitle className="text-xl font-bold">Create a new project</CardTitle>
      </CardHeader>

      <div className="px-6">
        <Separator />
      </div>

      <CardContent className="px-6">
        <form id="create-project-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    Project Name <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    type="text"
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter project name"
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
                  <FieldLabel>Project Image</FieldLabel>
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
                    Upload an image to represent your project. Supported formats: JPG, PNG, SVG or JPEG. Max size: 1MB.
                  </FieldDescription>

                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}

                  {imagePreviewUrl ? (
                    <div className="flex w-fit flex-row items-end gap-4">
                      <div className="relative size-18 overflow-hidden rounded-md border border-neutral-200">
                        <Image src={imagePreviewUrl} alt="Project Image" fill className="object-cover" />
                      </div>
                      <Button
                        size={'sm'}
                        title="Remove Image"
                        onClick={() => {
                          field.onChange(undefined);
                          resetImageInput();
                        }}
                        variant={'destructive'}
                      >
                        <Trash2Icon />
                      </Button>
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
          <Button type="submit" form="create-project-form" disabled={form.formState.isSubmitting || isPending}>
            {(form.formState.isSubmitting || isPending) && <Spinner data-icon="inline-start" />}

            {form.formState.isSubmitting || isPending ? 'Creating...' : 'Create Project'}
          </Button>

          <Button
            type="button"
            variant={'outline'}
            onClick={handleCancel}
            disabled={form.formState.isSubmitting || isPending}
            className={cn(Boolean(onCancel) ? 'block' : 'hidden')}
          >
            Cancel
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
};
