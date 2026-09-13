import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "@/auth.config";
import { getAuthSecret, isAdminEmail } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: getAuthSecret() ?? undefined,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const email =
            typeof credentials?.email === "string"
              ? credentials.email.trim().toLowerCase()
              : "";
          const password =
            typeof credentials?.password === "string" ? credentials.password : "";

          if (!email || !password) {
            return null;
          }

          if (!isAdminEmail(email)) {
            return null;
          }

          const admin = await prisma.adminUser.findUnique({
            where: { email },
          });

          if (!admin || !admin.isActive || !admin.passwordHash) {
            return null;
          }

          const valid = await bcrypt.compare(password, admin.passwordHash);
          if (!valid) {
            return null;
          }

          await prisma.adminUser.update({
            where: { id: admin.id },
            data: { lastLogin: new Date() },
          });

          return {
            id: admin.id,
            email: admin.email,
            name: admin.name,
          };
        } catch (error) {
          console.error("[auth] authorize failed", error);
          return null;
        }
      },
    }),
  ],
  trustHost: true,
});
