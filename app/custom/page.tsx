import CustomForm from './CustomForm';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Design your own tee' };

export default function CustomPage() {
  return (
    <main className="wrap" style={{ paddingBottom: 80, maxWidth: 560 }}>
      <h1 style={{ fontSize: '2rem', margin: '26px 0 4px' }}>Design your own tee</h1>
      <p className="muted" style={{ marginTop: 0 }}>Upload your art, pick a color — we&apos;ll quote you</p>

      <CustomForm />
    </main>
  );
}
