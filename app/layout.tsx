import type { Metadata } from 'next';
import { PT_Serif, Open_Sans } from 'next/font/google';
import './globals.css';

const ptSerif = PT_Serif({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-pt-serif',
  display: 'swap',
});

const openSans = Open_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-open-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Křesťanský sbor Brno | Moderní společenství víry a naděje',
  description: 'Křesťanský sbor Brno – otevřené společenství lidí v Brně-Židenicích. Běžná setkávání, nedělní bohoslužby, mládež Elevate, besídka pro děti, knihovna DEN a kázání.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs" className={`${ptSerif.variable} ${openSans.variable}`}>
      <body className={openSans.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

