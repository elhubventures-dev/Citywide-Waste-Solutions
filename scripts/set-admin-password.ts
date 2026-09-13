/**
 * Set or update an admin user's password hash in the database.
 *
 * Usage:
 *   npx tsx scripts/set-admin-password.ts <email> <password> [name]
 *
 * Example:
 *   npx tsx scripts/set-admin-password.ts wastesolutions80@gmail.com 'your-secure-password'
 */

import { config } from "dotenv";
import { resolve } from "path";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  const password = process.argv[3];
  const name = process.argv[4]?.trim() || email?.split("@")[0] || "Admin";

  if (!email || !password) {
    console.error(
      "Usage: npx tsx scripts/set-admin-password.ts <email> <password> [name]"
    );
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("Password must be at least 8 characters.");
    process.exit(1);
  }

  const prisma = new PrismaClient();
  const passwordHash = await bcrypt.hash(password, 12);

  try {
    const admin = await prisma.adminUser.upsert({
      where: { email },
      create: {
        email,
        name,
        role: "OWNER",
        passwordHash,
        isActive: true,
      },
      update: {
        passwordHash,
        isActive: true,
        ...(process.argv[4] ? { name } : {}),
      },
    });

    console.log(`Admin password set for ${admin.email} (id: ${admin.id}).`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
