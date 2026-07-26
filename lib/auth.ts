import { cookies } from 'next/headers';
import { createHmac } from 'crypto';
import { BOSS_PASSWORD } from './config';

const COOKIE = 'sns_boss';

function token() {
  return createHmac('sha256', BOSS_PASSWORD)
    .update('boss').digest('hex').slice(0, 32);
}

export async function isBoss() {
  const c = await cookies();
  return c.get(COOKIE)?.value === token();
}

export async function signIn(password: string) {
  if (password !== BOSS_PASSWORD) return false;
  const c = await cookies();
  c.set(COOKIE, token(), {
    httpOnly: true, sameSite: 'lax', secure: true, path: '/',
    maxAge: 60 * 60 * 24 * 365,
  });
  return true;
}

export async function signOut() {
  const c = await cookies();
  c.delete(COOKIE);
}
