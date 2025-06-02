import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
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
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub as string;
      }
      return session;
    }
  }
});

export { handler as GET, handler as POST };