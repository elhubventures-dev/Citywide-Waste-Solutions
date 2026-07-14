import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendInvoiceEmail } from "@/lib/email";

export const runtime = "nodejs";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { to, cc, bcc, subject, message, pdfBase64 } = body;

    if (!to || !subject || !message || !pdfBase64) {
      return NextResponse.json(
        { error: "Missing required fields (to, subject, message, pdfBase64)" },
        { status: 400 }
      );
    }

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: { client: true },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // Prepare arrays for cc and bcc if provided as comma-separated strings
    const parseEmails = (val?: string) => 
      val ? val.split(",").map(e => e.trim()).filter(Boolean) : undefined;

    await sendInvoiceEmail({
      to: parseEmails(to) || to,
      cc: parseEmails(cc),
      bcc: parseEmails(bcc),
      subject,
      message,
      invoiceNumber: invoice.invoiceNumber,
      brand: invoice.brand,
      pdfBase64,
    });

    // Update the invoice status to Sent if it's currently Draft, and log the activity
    await prisma.invoice.update({
      where: { id },
      data: {
        status: invoice.status === "Draft" ? "Sent" : invoice.status,
        activities: {
          create: {
            action: "SENT",
            notes: `Invoice emailed to ${to}`,
          }
        }
      },
    });

    return NextResponse.json({ success: true, message: "Email sent successfully" });
  } catch (error: any) {
    console.error("Error sending invoice email:", error);
    return NextResponse.json(
      { error: "Failed to send email. Ensure Resend API is configured." },
      { status: 500 }
    );
  }
}
