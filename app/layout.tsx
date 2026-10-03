import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';
import { headers } from 'next/headers';
import type { ReactNode } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';
import { WebVitals } from '@/components/web-vitals';
import { env } from '@/lib/env';
import './globals.css';

const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });

export const dynamic = 'force-dynamic';

export const metadata = {
  metadataBase: new URL(env.APP_URL),
  title: {
    default: 'Next.js Boilerplate',
    template: '%s | Next.js Boilerplate',
  },
  description: 'A secure, maintainable foundation for modern web applications.',
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const nonce = (await headers()).get('x-nonce') ?? undefined;

  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <Script id="theme-init" nonce={nonce} strategy="beforeInteractive">
          {`(() => {
  try {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    document.documentElement.classList.toggle('dark', savedTheme ? savedTheme === 'dark' : prefersDark)
  } catch {
    document.documentElement.classList.toggle('dark', window.matchMedia('(prefers-color-scheme: dark)').matches)
  }
})()`}
        </Script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <WebVitals />
        <header className="border-foreground/10 border-b">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-5">
            <a className="font-semibold tracking-tight" href="/">
              Next.js Boilerplate
            </a>
            <ThemeToggle />
          </div>
        </header>
        {children}
        <footer className="border-foreground/10 border-t">
          <p className="text-foreground/60 mx-auto max-w-5xl px-6 py-6 text-sm">
            Built to be adapted, measured, and maintained.
          </p>
        </footer>
      </body>
    </html>
  );
}
