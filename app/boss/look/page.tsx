import { getTheme } from '@/lib/db';
import Editor from './Editor';

export const dynamic = 'force-dynamic';

export default async function Look({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const sp = await searchParams;
  const theme = await getTheme();
  return <Editor theme={JSON.parse(JSON.stringify(theme))} saved={sp.saved === '1'} />;
}
