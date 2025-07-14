import NextAuth, { NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { jwtDecode } from 'jwt-decode';
import { login } from '@/features/auth/api/authApi';
import { createFormData } from '@/features/common/utils/formDataUtil';

declare module 'next-auth' {
  interface User {
    accessToken: string;
    sub: string;
    name: string;
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
  }
}

interface JwtPayload {
  sub: string;
  role: string;
  name: string;
  token_type: string;
  exp: number;
}

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: {},
        password: {},
      },
      async authorize(credentials) {
        try {
          const formData = createFormData(credentials);
          const response = await login(formData);

          if (response?.access_token) {
            const decodedToken: JwtPayload = jwtDecode(response.access_token);

            return {
              accessToken: response.access_token,
              sub: decodedToken.sub,
              name: decodedToken.name,
            } as User;
          }
        } catch (error) {
          console.error('Authorization error:', error);
        }
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
