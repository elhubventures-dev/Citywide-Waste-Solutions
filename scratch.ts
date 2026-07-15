import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    const invoices = await prisma.invoice.findMany();
    console.log("Invoices in DB:", invoices.map(i => i.invoiceNumber));
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
