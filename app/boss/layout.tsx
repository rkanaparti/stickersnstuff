import Link from 'next/link';
import { isBoss } from '@/lib/auth';
import SignInForm from './SignInForm';
import BossNav from './BossNav';

export const dynamic = 'force-dynamic';

export default async function BossLayout({ children }: { children: React.ReactNode }) {
  if (!(await isBoss())) return <SignInForm />;

  return (
    <div className="wrap" style={{ maxWidth: 640, minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <Link href="/" target="_blank" className="viewstore-btn">
        👀 View store
      </Link>
      <div style={{ flex: 1, paddingTop: 66 }}>{children}</div>
      <BossNav />
    </div>
  );
}
