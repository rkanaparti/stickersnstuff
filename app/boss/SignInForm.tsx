'use client';
import { useActionState } from 'react';
import { doSignIn } from './actions';

export default function SignInForm() {
  const [state, action, pending] = useActionState(doSignIn, { error: '' } as any);

  return (
    <main className="wrap center" style={{ maxWidth: 400, paddingTop: 90 }}>
      <h1 style={{ fontSize: '2.4rem' }}>Hey boss</h1>
      <form action={action} style={{ marginTop: 24, textAlign: 'left' }}>
        <label htmlFor="pw">Password</label>
        <input id="pw" name="password" type="password" autoFocus autoComplete="current-password" />
        <div style={{ marginTop: 20 }}>
          <button className="btn" disabled={pending}>{pending ? 'Checking…' : 'Let me in'}</button>
        </div>
      </form>
      {state?.error && <p style={{ color: '#B4304A', fontWeight: 600 }}>{state.error}</p>}
    </main>
  );
}
