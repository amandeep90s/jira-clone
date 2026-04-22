import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/ui/mode-toggle';

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1>Jira Clone</h1>
      <ModeToggle />
      <Button variant={'default'}>Click Me</Button>
      <Button variant={'destructive'}>Click Me</Button>
      <Button variant={'ghost'}>Click Me</Button>
      <Button variant={'link'}>Click Me</Button>
      <Button variant={'outline'}>Click Me</Button>
      <Button variant={'secondary'}>Click Me</Button>
    </div>
  );
}
