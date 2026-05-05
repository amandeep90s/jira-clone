import Image from 'next/image';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface WorkspaceAvatarProps {
  image?: string;
  name: string;
  className?: string;
}

export default function WorkspaceAvatar({ image, name, className }: WorkspaceAvatarProps) {
  if (image) {
    return (
      <div className={cn('size-10 overflow-hidden rounded-md', className)}>
        <Image src={image} alt={name} className="object-cover" width={40} height={40} />
      </div>
    );
  }

  return (
    <Avatar className={cn('size-10 rounded-md', className)}>
      <AvatarFallback className="text-foreground rounded-md text-sm font-semibold uppercase">
        {name[0]}
      </AvatarFallback>
    </Avatar>
  );
}
