import type { Metadata } from 'next';
import './globals.css';
import ServiceWorkerRegistration from '@/components/service-worker-registration';

export const metadata: Metadata = {
  title: 'Concert Finder | Live Tour Radar & Festival Guide',
  description: 'Discover live concerts, festival stages, setlists, and ticket alerts with interactive venue radar maps and audio previews.',
  keywords: ['concerts', 'live music', 'tour dates', 'festivals', 'tickets', 'venues', 'setlists'],
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  appleWebApp: {
    title: 'Concert Finder',
    statusBarStyle: 'black-translucent',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        <meta name="theme-color" content="#090a10" />
      </head>
      <body className="min-h-screen bg-[#090a10] text-slate-100 antialiased selection:bg-purple-500/30 selection:text-purple-200">
        <ServiceWorkerRegistration />
        {children}
      </body>
    </html>
  );
}
