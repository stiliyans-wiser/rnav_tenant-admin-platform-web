import { headers } from 'next/headers';
import LoginPage from './login-page';
import TaqaLoginPage from './taqa-login-page';

export default async function Page() {
  const hdrs = headers();
  const host = hdrs.get('x-forwarded-host') ?? hdrs.get('host') ?? '';
  const isTaqa = host.includes('taqa');

  if (isTaqa) {
    return <TaqaLoginPage />;
  }
  return <LoginPage />;
}
