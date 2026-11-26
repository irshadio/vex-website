import { highlight } from '@/lib/highlight';
import { cn } from '@/lib/cn';

/// Highlighted Vex code, rendered on the server.
export async function Code({ code, className }: { code: string; className?: string }) {
  const html = await highlight(code);
  return <div className={cn('vx-code overflow-x-auto', className)} dangerouslySetInnerHTML={{ __html: html }} />;
}
