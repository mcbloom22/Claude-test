import './globals.css';

export const metadata = {
  title: 'Reserve',
  description: 'Personal restaurant discovery and reservation tracker',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Reserve',
  },
};

export const viewport = {
  themeColor: '#E8472A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="bg-gray-50 text-gray-900 max-w-lg mx-auto min-h-screen">
        {children}
      </body>
    </html>
  );
}
