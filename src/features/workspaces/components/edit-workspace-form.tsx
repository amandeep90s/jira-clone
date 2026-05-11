'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeftIcon, ImageIcon, Trash2Icon } from 'lucide-react';
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
import { useUpdateWorkspace } from '@/features/workspaces/api/use-update-workspace';
import { UpdateWorkspaceFormData, updateWorkspaceSchema } from '@/features/workspaces/schemas';
import { Workspace } from '@/features/workspaces/types';
import { cn } from '@/lib/utils';

interface EditWorkspaceFormProps {
  initialValues: Workspace;
  onCancel?: () => void;
}

export const EditWorkspaceForm = ({ initialValues, onCancel }: EditWorkspaceFormProps) => {
  const router = useRouter();
  console.log(initialValues);
  const { mutate, isPending } = useUpdateWorkspace();
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(initialValues.imageUrl ?? null);
  const [fileInputKey, setFileInputKey] = useState(0);

  // Revoke the blob URL whenever the preview URL changes or on unmount
  useEffect(() => {
    return () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    };
  }, [imagePreviewUrl]);

  const form = useForm<UpdateWorkspaceFormData>({
    resolver: zodResolver(updateWorkspaceSchema),
    mode: 'onSubmit',
    defaultValues: {
      ...initialValues,
      image: initialValues.imageUrl ?? '',
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
    (formData: UpdateWorkspaceFormData) => {
      const finalValues = { ...formData, image: formData.image instanceof File ? formData.image : '' };
      mutate(
        { form: finalValues, workspaceId: initialValues.$id },
        {
          onSuccess: ({ data }) => {
            router.push(`/workspaces/${data.$id}`);
            toast.success('Workspace updated successfully!');
          },
          onError: () => toast.error('Failed to update workspace. Please try again.'),
        },
      );
    },
    [mutate, router, initialValues.$id],
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
      <CardHeader className="flex flex-row items-center space-y-0 gap-x-4">
        <Button
          size="sm"
          variant={'secondary'}
          onClick={onCancel ? onCancel : () => router.push(`/workspaces/${initialValues.$id}`)}
        >
          <ArrowLeftIcon size={5} />
          Back
        </Button>
        <CardTitle className="text-xl font-bold">Edit {initialValues.name}</CardTitle>
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
                    <div className="flex w-fit flex-row items-end gap-4">
                      <div className="relative size-18 overflow-hidden rounded-md border border-neutral-200">
                        <Image src={imagePreviewUrl} alt="Workspace Image" fill className="object-cover" />
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
          <Button type="submit" form="create-workspace-form" disabled={form.formState.isSubmitting || isPending}>
            {(form.formState.isSubmitting || isPending) && <Spinner data-icon="inline-start" />}

            {form.formState.isSubmitting || isPending ? 'Saving...' : 'Save Changes'}
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
