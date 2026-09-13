import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe Auth.js config (no Prisma / Node-only imports).
 * Full providers live in `src/auth.ts`.
 */
export const authConfig = {
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  providers: [],
  callbacks: {
    authorized() {
      // Route protection is handled in requireAdminPageAccess / requireAdminApiAccess.
      return true;
    },
    jwt({ token, user }) {
      if (user?.email) {
        token.email = user.email;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.email) {
        session.user.email = token.email as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
