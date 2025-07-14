import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import InitColorSchemeScript from '@mui/system/InitColorSchemeScript';
import { AppLayout } from '@/features/layout/components/AppLayout';
import { AuthGuard } from '@/features/auth/components/AuthGuard';
import { ClientProviders } from '@/features/common/providers/ClientProviders';

import '../index.scss';

export const metadata: Metadata = {
  title: 'Productised AI Services - Back-office',
  description: 'Back office platform for tenant management',
};

const font = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={font.variable}>
        <InitColorSchemeScript modeStorageKey="mui-mode" attribute="data-mui-color-scheme" />
        <ClientProviders>
          <AuthGuard>
            <AppLayout>{children}</AppLayout>
          </AuthGuard>
        </ClientProviders>
      </body>
    </html>
  );
}
