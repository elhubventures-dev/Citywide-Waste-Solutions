import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: params.id },
      include: {
        client: true,
        items: true,
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json({ invoice });
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return NextResponse.json({ error: "Failed to fetch invoice" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { client, meta, rows, totals } = body;

    // Delete existing items to replace them with the updated ones
    await prisma.invoiceItem.deleteMany({
      where: { invoiceId: params.id },
    });

    const updatedInvoice = await prisma.invoice.update({
      where: { id: params.id },
      data: {
        invoiceNumber: meta.invoiceNo,
        issueDate: meta.issueDate,
        dueDate: meta.dueDate,
        currency: meta.currency,
        terms: meta.terms,
        status: meta.status,
        brand: meta.brand,
        subtotal: totals.subtotal,
        discountTotal: totals.discountTotal,
        taxTotal: totals.taxTotal,
        grandTotal: totals.grandTotal,
        deposit: meta.deposit,
        amountPaid: meta.amountPaid,
        balanceDue: totals.balanceDue,
        client: {
          update: {
            company: client.company,
            name: client.name,
            email: client.email,
            phone: client.phone,
            serviceAddress: client.serviceAddress,
            billingAddress: client.billingAddress,
            city: client.city,
            province: client.province,
            country: client.country,
            zip: client.zip,
            taxNumber: client.taxNumber,
            notes: client.notes,
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
      },
      include: {
        client: true,
        items: true,
      },
    });

    return NextResponse.json({ invoice: updatedInvoice });
  } catch (error) {
    console.error("Error updating invoice:", error);
    return NextResponse.json({ error: "Failed to update invoice" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.invoice.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting invoice:", error);
    return NextResponse.json({ error: "Failed to delete invoice" }, { status: 500 });
  }
}
