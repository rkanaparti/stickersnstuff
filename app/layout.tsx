import './globals.css';
import { getTheme } from '@/lib/db';
import SiteHeader from '@/components/SiteHeader';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const t = await getTheme();
  return { title: t.store_name, description: t.tagline };
}

const gf = (family: string) =>
  `family=${family.replace(/ /g, '+')}:wght@400;500;600;700;800`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const t = await getTheme();
  const href =
    `https://fonts.googleapis.com/css2?${gf(t.f_display)}&${gf(t.f_body)}&display=swap`;

  const vars = `:root{
    --paper:${t.c_paper}; --ink:${t.c_ink}; --primary:${t.c_primary};
    --accent:${t.c_accent}; --highlight:${t.c_highlight};
    --radius:${t.radius_px}px;
    --font-display:'${t.f_display}'; --font-body:'${t.f_body}';
    --tilt-a:${t.tilt_on ? '-1.6deg' : '0deg'};
    --tilt-b:${t.tilt_on ? '1.2deg' : '0deg'};
    --tilt-c:${t.tilt_on ? '-0.7deg' : '0deg'};
  }`;

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={href} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style dangerouslySetInnerHTML={{ __html: vars }} />
      </head>
      <body>
        <SiteHeader storeName={t.store_name} tagline={t.tagline} logoUrl={t.logo_url} />
        {children}
      </body>
    </html>
  );
}
