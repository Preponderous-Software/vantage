import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials: any, req: any) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_VANTAGE_API_URL}/login`, {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { 'Content-Type': 'application/json' }
        });
        const user = await res.json();
        if (res.ok && user) {
          return user;
        }
        return null;
      }
    })
  ],
  theme: {
    colorScheme: 'dark'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    }
  }
}

export default NextAuth(authOptions)