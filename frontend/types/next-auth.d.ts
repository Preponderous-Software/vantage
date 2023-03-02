import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user?: {
      token: string,
      userId: string,
      username: string
    }
  }

  interface User {
    token: string,
    userId: string,
    username: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user?: {
      token: string,
      userId: string,
      username: string
    }
  }
}