import type { Metadata } from 'next';
import InitColorSchemeScript from '@mui/system/InitColorSchemeScript';
import { AppLayout } from '@/features/layout/components/AppLayout';
import { AuthGuard } from '@/features/auth/components/AuthGuard';
import { ClientProviders } from '@/features/common/providers/ClientProviders';

import '../index.scss';
import { colorSchemeSelectorConst, muiModeStorageKeyConst } from '@/features/theming/constants/themingConst';

export const metadata: Metadata = {
  title: 'Productised AI Factory - Back-office',
  description: 'Back office platform for tenant management',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <InitColorSchemeScript modeStorageKey={muiModeStorageKeyConst} attribute={colorSchemeSelectorConst} />
        <ClientProviders>
          <AuthGuard>
            <AppLayout>{children}</AppLayout>
          </AuthGuard>
        </ClientProviders>
      </body>
    </html>
  );
}
