import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const client = { company: "Test", name: "Test", email: "test@test.com" };
  const meta = {
    invoiceNo: `INV-TEST-${Date.now()}`,
    issueDate: "2024-01-01",
    dueDate: "2024-01-31",
    currency: "CAD",
    terms: "Net 30",
    status: "Draft",
    brand: "waste",
    type: "INVOICE",
    deposit: 0,
    amountPaid: 0,
  };
  const rows = [
    { service: "Test service", description: "", qty: 1, unit: "unit", price: 100, discount: 0, tax: 13 }
  ];
  const totals = { subtotal: 100, discountTotal: 0, taxTotal: 13, grandTotal: 113, balanceDue: 113 };

  try {
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber: meta.invoiceNo,
        issueDate: meta.issueDate,
        dueDate: meta.dueDate,
        currency: meta.currency,
        terms: meta.terms,
        status: meta.status,
        brand: meta.brand,
        type: meta.type,
        subtotal: totals.subtotal,
        discountTotal: totals.discountTotal,
        taxTotal: totals.taxTotal,
        grandTotal: totals.grandTotal,
        deposit: meta.deposit,
        amountPaid: meta.amountPaid,
        balanceDue: totals.balanceDue,
        client: {
          create: {
            company: client.company,
            name: client.name,
            email: client.email,
          },
        },
        items: {
          create: rows.map((r: any) => ({
            service: r.service,
            description: r.description,
            qty: r.qty,
            unit: r.unit,
            price: r.price,
            discount: r.discount,
            tax: r.tax,
          })),
        },
        activities: {
          create: {
            action: "CREATED",
            notes: "Invoice was created.",
          }
        },
      },
    });
    console.log("Created successfully:", invoice.id);
  } catch (error) {
    console.error("Creation failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
