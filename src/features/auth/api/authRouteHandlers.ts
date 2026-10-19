import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { handlers, recordBackofficeLogout } from '@/features/auth/api/authOptions';

type RouteContext = { params: { nextauth: string[] } };

export const GET = handlers;

export async function POST(req: NextRequest, ctx: RouteContext) {
  if (ctx.params?.nextauth?.[0] === 'signout') {
    const token = await getToken({ req });
    await recordBackofficeLogout(token, Object.fromEntries(req.headers.entries()));
  }
  return handlers(req, ctx);
}
