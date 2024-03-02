import { BASE_HTTP } from "@/utils/constants";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        name: { label: "Name", type: "text", placeholder: "my name" },
        password: { label: "Password", type: "password" },
        email: {
          label: "Email",
          type: "email",
          placeholder: "email@email.com",
        },
      },
      async authorize(credentials, req): Promise<any> {
        const res = await fetch(`${BASE_HTTP}/auth/signin`, {
          method: "POST",
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        const { tokens } = data;
        const findU = data.user;
        // If no error and we have user data, return it
        if (res.ok && findU) {
          const user = {
            name: findU.name,
            email: findU.email,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
          };
          return user;
        }
        return null; //if user data could not be retrieved
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ session, token, user }) {
      if (token) {
        session = { ...token, user: token };
      }
      return { ...user, ...session, ...token };
    },
    async session({ session, token, user }) {
      session.user = token as any;

      return session;
    },
  },
  pages: {
    signIn: "/registrar",
  },
};
export const authOptions = options;
