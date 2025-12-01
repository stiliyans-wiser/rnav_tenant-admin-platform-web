import type { Metadata } from 'next';
import InitColorSchemeScript from '@mui/system/InitColorSchemeScript';
import { AppLayout } from '@/features/layout/components/AppLayout';
import { AuthGuard } from '@/features/auth/components/AuthGuard';
import { ClientProviders } from '@/features/common/providers/ClientProviders';

import '../index.scss';
import { colorSchemeSelectorConst, muiModeStorageKeyConst } from '@/features/theming/constants/themingConst';
import { headers } from 'next/headers';

export async function generateMetadata(): Promise<Metadata> {
  const hdrs = headers();
  const host = hdrs.get('x-forwarded-host') ?? hdrs.get('host') ?? '';
  const isTaqa = host.includes('taqa');
  return {
    title: isTaqa ? 'TQ* Investment Advisor - Back Office' : 'Productised AI Factory - Back Office',
    description: isTaqa ? 'Back office platform for TQ* Investment Advisor' : 'Back office platform for Productised AI Factory',
  };
}

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
