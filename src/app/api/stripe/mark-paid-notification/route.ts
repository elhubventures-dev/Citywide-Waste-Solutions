import { NextResponse } from "next/server";
import { sendPaymentNotificationAdmin } from "@/lib/email";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { invoiceNumber, customerName, amount, email } = await req.json();

    if (!invoiceNumber || !customerName || amount === undefined) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // Try to get email from DB if not provided directly
    let clientEmail = email;
    if (!clientEmail) {
      const invoice = await prisma.invoice.findUnique({
        where: { invoiceNumber: invoiceNumber.toUpperCase() },
        include: { client: true },
      });
      if (invoice?.client?.email) {
        clientEmail = invoice.client.email;
      }
    }

    await sendPaymentNotificationAdmin(
      clientEmail || "Unknown",
      customerName,
      invoiceNumber,
      amount
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error sending admin notification:", error);
    return NextResponse.json({ success: false, error: "Failed to send notification" }, { status: 500 });
  }
}
