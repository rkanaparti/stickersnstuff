import Checkout from './Checkout';
import { STRIPE_SECRET_KEY } from '@/lib/config';

export const dynamic = 'force-dynamic';

export default function BagPage() {
  const stripeOn = Boolean(STRIPE_SECRET_KEY);
  return <Checkout stripeOn={stripeOn} />;
}
