import bcrypt from "bcryptjs";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash(process.env.ADMIN_SEED_PASSWORD || "Admin@12345", 12);
  await prisma.user.upsert({
    where: { email: process.env.ADMIN_SEED_EMAIL || "admin@unspokenhelp.com" },
    update: {},
    create: {
      name: "Platform Admin",
      email: process.env.ADMIN_SEED_EMAIL || "admin@unspokenhelp.com",
      password: adminPassword,
      role: Role.ADMIN,
      emailVerified: true
    }
  });

  await prisma.platformSetting.upsert({
    where: { id: "default-settings" },
    update: {},
    create: { id: "default-settings", commissionPercentage: 20, stripeEnabled: false }
  });
}

main().finally(() => prisma.$disconnect());
