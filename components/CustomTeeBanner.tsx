import Link from 'next/link';

export default function CustomTeeBanner() {
  return (
    <Link
      href="/custom"
      className="card"
      style={{ display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none' }}
    >
      <span style={{ fontSize: '2.2rem', lineHeight: 1 }} aria-hidden>👕</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700 }}>Design your own tee</div>
        <div className="muted" style={{ fontSize: '0.88rem' }}>
          Upload your art, pick a color — request a quote
        </div>
      </div>
      <span style={{ fontSize: '1.4rem' }} aria-hidden>→</span>
    </Link>
  );
}
