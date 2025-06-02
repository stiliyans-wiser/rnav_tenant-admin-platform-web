import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Montserrat } from 'next/font/google';
import '../index.scss';
import { AppLayout } from '@/features/layout/components/AppLayout';
import InitColorSchemeScript from '@mui/system/InitColorSchemeScript';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tenant Admin Platform',
  description: 'Admin platform for tenant management',
};

const font = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={font.variable}>
        <InitColorSchemeScript modeStorageKey="mui-mode" attribute="data-mui-color-scheme" />
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
} 
