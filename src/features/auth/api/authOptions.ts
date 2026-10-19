import NextAuth, { NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { jwtDecode } from 'jwt-decode';

declare module 'next-auth' {
  interface User {
    accessToken: string;
    sub: string;
    name: string;
    sessionId?: string;
  }

  interface Session {
    accessToken: string;
    user: {
      name: string;
      sub: string;
    };
  }

  interface JWT {
    accessToken: string;
    sub: string;
    name: string;
    sessionId?: string;
  }
}

interface JwtPayload {
  sub: string;
  role: string;
  name: string;
  token_type: string;
  exp: number;
}

const DNS_TRANSIENT_CODES = new Set(['EAI_AGAIN', 'ENOTFOUND', 'ECONNRESET', 'UND_ERR_SOCKET']);

async function fetchWithDnsRetry(url: string, init?: RequestInit): Promise<Response> {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      return await fetch(url, init);
    } catch (err) {
      const code = err instanceof Error
        ? (err as Error & { cause?: { code?: string } }).cause?.code
        : undefined;
      if (attempt === 0 && code !== undefined && DNS_TRANSIENT_CODES.has(code)) {
        await new Promise<void>(resolve => setTimeout(resolve, 300));
        continue;
      }
      throw err;
    }
  }
  throw new Error('fetchWithDnsRetry: unreachable');
}

type IncomingHeaders = Record<string, string | string[] | undefined> | undefined;

function headerValue(headers: IncomingHeaders, name: string): string | undefined {
  const value = headers?.[name];
  const first = Array.isArray(value) ? value[0] : value;
  return first?.trim() || undefined;
}

export function buildClientForwardHeaders(headers: IncomingHeaders): Record<string, string> {
  const result: Record<string, string> = {};
  const ip = headerValue(headers, 'x-real-ip') || headerValue(headers, 'x-forwarded-for')?.split(',').pop()?.trim();
  if (ip) result['X-Forwarded-For'] = ip;
  const userAgent = headerValue(headers, 'user-agent');
  if (userAgent) result['X-Client-User-Agent'] = userAgent;
  return result;
}

export async function recordBackofficeLogout(
  jwt: object | null,
  headers: IncomingHeaders,
): Promise<void> {
  const token = jwt as { accessToken?: unknown; sessionId?: unknown } | null;
  if (typeof token?.accessToken !== 'string' || typeof token?.sessionId !== 'string') return;
  try {
    const apiUrl = process.env.INTERNAL_API_URL || process.env.API_BASE_URL || 'http://api:8000';
    await fetchWithDnsRetry(`${apiUrl}/backoffice/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.accessToken}`,
        ...buildClientForwardHeaders(headers),
      },
      body: JSON.stringify({ session_id: token.sessionId }),
      signal: AbortSignal.timeout(3000),
    });
  } catch (error) {
    console.error('Backoffice logout call failed:', error);
  }
}

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: {},
        password: {},
      },
      async authorize(credentials, req) {
        try {
          const apiUrl = process.env.INTERNAL_API_URL || process.env.API_BASE_URL || 'http://api:8000';
          const params = new URLSearchParams();
          if (credentials?.username) params.append('username', credentials.username);
          if (credentials?.password) params.append('password', credentials.password);

          const res = await fetchWithDnsRetry(`${apiUrl}/backoffice/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded', ...buildClientForwardHeaders(req?.headers) },
            body: params.toString(),
          });

          if (!res.ok) return null;
          const data = await res.json();

          if (data?.access_token) {
            const decodedToken: JwtPayload = jwtDecode(data.access_token);

            return {
              accessToken: data.access_token,
              sub: decodedToken.sub,
              name: decodedToken.name,
              sessionId: data.session_id,
            } as User;
          }
        } catch (error) {
          console.error('Authorization error:', error);
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.sub = user.sub;
        token.name = user.name;
        token.sessionId = user.sessionId;
      }

      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.user = {
        name: token.name as string,
        sub: token.sub as string,
      };

      return session;
    },
  },
};

export const handlers = NextAuth(authOptions);
