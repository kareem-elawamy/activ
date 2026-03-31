import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (
          credentials?.username === "admin" &&
          credentials?.password === "activadmin123"
        ) {
          return { id: 1, name: "Admin", role: "admin" };
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt", // مهم جداً في App Router
  },
  pages: {
    signIn: "/admin-login",
  },
  debug: true,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };