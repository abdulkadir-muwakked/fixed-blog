import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function testConnection() {
  try {
    const tables =
      await prisma.$queryRaw`SELECT name FROM sqlite_master WHERE type='table';`;
    console.log("الجداول الموجودة:", tables);

    const posts = await prisma.post.findMany();
    console.log("المقالات:", posts);
  } catch (error) {
    console.error("خطأ في الاتصال:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
