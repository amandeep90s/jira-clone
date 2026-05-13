import Image from 'next/image';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface ProjectAvatarProps {
  image?: string;
  name: string;
  className?: string;
  fallbackClassName?: string;
}

export default function ProjectAvatar({ image, name, className, fallbackClassName }: ProjectAvatarProps) {
  if (image) {
    return (
      <div className={cn('relative size-5 overflow-hidden rounded-md border border-neutral-200', className)}>
        <Image src={image} alt={name} fill className="object-cover" />
      </div>
    );
  }

  return (
    <Avatar className={cn('size-5 rounded-md', className)}>
      <AvatarFallback
        className={cn(
          'text-foreground rounded-md border border-neutral-200 text-sm font-semibold uppercase',
          fallbackClassName,
        )}
      >
        {name[0]}
      </AvatarFallback>
    </Avatar>
  );
}
