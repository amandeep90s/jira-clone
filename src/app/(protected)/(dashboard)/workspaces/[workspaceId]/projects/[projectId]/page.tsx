import { redirect } from 'next/navigation';

import { getUser } from '@/features/auth/queries';

interface ProjectDetailProps {
  params: Promise<{
    workspaceId: string;
    projectId: string;
  }>;
}

export default async function ProjectDetail({ params }: ProjectDetailProps) {
  const { workspaceId, projectId } = await params;

  const user = await getUser();

  if (!user) redirect('/sign-in');

  return <div>ProjectDetail</div>;
}
