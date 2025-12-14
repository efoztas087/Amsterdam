import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("admin123", 10);

  await prisma.admin.create({
    data: {
      email: "admin@amsterdam.nl",
      password,
    },
  });

  console.log("Admin user created");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());