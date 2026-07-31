import CustomForm from './CustomForm';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Design your own tee' };

export default function CustomPage() {
  return (
    <main className="wrap" style={{ paddingBottom: 80, maxWidth: 560 }}>
      <header className="masthead">
        <h1 style={{ fontSize: 'clamp(2rem, 7vw, 3rem)' }}>Design your own tee</h1>
        <p className="tagline">Upload your art, pick a color — we&apos;ll quote you</p>
      </header>

      <CustomForm />
    </main>
  );
}
