import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextRequest } from "next/server";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // TODO: Replace with actual auth logic
        if (credentials?.email === "demo@example.com" && credentials?.password === "password") {
          return {
            id: "1",
            email: credentials.email,
            name: "Demo User"
          };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/sign-in',
    signOut: '/sign-out',
    error: '/sign-in',
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    }
  }
};

// Create GET and POST handlers that properly pass the request context
export async function GET(req: NextRequest) {
  return await NextAuth(authOptions)(req);
}

export async function POST(req: NextRequest) {
  return await NextAuth(authOptions)(req);
}