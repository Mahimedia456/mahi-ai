import pkg from "@prisma/client";
import bcrypt from "bcryptjs";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

async function main() {
  const hashed = await bcrypt.hash("Admin@123456", 10);

  await prisma.user.upsert({
    where: { email: "admin@mahimediasolutions.com" },
    update: {},
    create: {
      fullName: "Mahi AI Admin",
      email: "admin@mahimediasolutions.com",
      passwordHash: hashed,
      role: "super_admin",
      status: "active",
      emailVerifiedAt: new Date(),
      usageWallet: {
        create: {
          chatCreditsRemaining: 999999,
          imageCreditsRemaining: 999999,
          videoCreditsRemaining: 999999,
          storageUsedMb: 0
        }
      }
    }
  });

  await prisma.plan.upsert({
    where: { slug: "starter" },
    update: {},
    create: {
      name: "Starter",
      slug: "starter",
      description: "Starter plan for Mahi AI users",
      priceMonthly: 0,
      priceYearly: 0,
      creditsMonthly: 100,
      imageGenerationsLimit: 20,
      videoGenerationsLimit: 5,
      chatMessagesLimit: 100,
      maxFileUploadMb: 10,
      featuresJson: ["Chat access", "Basic image generation", "Limited video generation"],
      isActive: true,
      sortOrder: 1
    }
  });

  await prisma.plan.upsert({
    where: { slug: "pro" },
    update: {},
    create: {
      name: "Pro",
      slug: "pro",
      description: "Professional plan for power users",
      priceMonthly: 29,
      priceYearly: 290,
      creditsMonthly: 1000,
      imageGenerationsLimit: 300,
      videoGenerationsLimit: 50,
      chatMessagesLimit: 2000,
      maxFileUploadMb: 100,
      featuresJson: ["Unlimited-style workflows", "Higher generation limits", "Priority processing"],
      isActive: true,
      sortOrder: 2
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });