import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import '../index.scss';
import { AppLayout } from '@/features/layout/components/AppLayout';
import InitColorSchemeScript from '@mui/system/InitColorSchemeScript';
import { AuthProvider } from '@/features/auth/context/AuthContext';
import { AuthGuard } from '@/features/auth/components/AuthGuard';
import { QueryProvider } from '@/features/common/providers/QueryProvider';

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
        <QueryProvider>
          <AuthProvider>
            <AuthGuard>
              <AppLayout>{children}</AppLayout>
            </AuthGuard>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
