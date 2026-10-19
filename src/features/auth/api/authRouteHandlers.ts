import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { handlers, recordBackofficeLogout } from '@/features/auth/api/authOptions';

type RouteContext = { params: { nextauth: string[] } };

export const GET = handlers;

export function isSuccessfulSignout(res: Response): boolean {
  const location = res.headers.get('location') ?? '';
  if (location.includes('csrf=true')) return false;
  return res.headers
    .getSetCookie()
    .some((cookie) => /session-token/i.test(cookie.split('=')[0]) && /max-age=0/i.test(cookie));
}

async function readSessionToken(req: NextRequest) {
  try {
    return await getToken({ req });
  } catch (error) {
    console.error('Backoffice logout: could not read session token:', error);
    return null;
  }
}

export async function POST(req: NextRequest, ctx: RouteContext) {
  const isSignout = ctx.params?.nextauth?.[0] === 'signout';
  const token = isSignout ? await readSessionToken(req) : null;
  const res = await handlers(req, ctx);
  if (isSignout && token && isSuccessfulSignout(res)) {
    await recordBackofficeLogout(token, Object.fromEntries(req.headers.entries()));
  }
  return res;
}
