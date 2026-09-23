import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { PwaProvider } from '@/components/pwa/PwaProvider';

export const metadata: Metadata = {
  title: 'FAST SERVICES | FAST ENGINEERING SOLUTIONS',
  description: 'Fast Engineering Solutions is a versatile general contractor founded in 2012, delivering end-to-end construction, power & engineering solutions throughout Pakistan.',
  applicationName: 'FAST SERVICES',
  appleWebApp: {
    capable: true,
    title: 'FAST SERVICES',
    statusBarStyle: 'black-translucent',
  },
  formatDetection: {
    telephone: false,
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: '#090d16',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="FAST SERVICES" />
      </head>
      <body className="min-h-screen flex flex-col antialiased selection:bg-blue-600 selection:text-white pb-14 md:pb-0">
        <AuthProvider>
          <PwaProvider>
            {children}
          </PwaProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
