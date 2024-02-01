import type { Metadata } from 'next';
import { Open_Sans, Roboto } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

const openSans = Open_Sans({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-open-sans',
});
const roboto = Roboto({
  display: 'swap',
  weight: ['500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  title: 'Extreme',
  description: 'AI Platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang='en'>
        <body className={`${roboto.variable} ${openSans.variable}`}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
