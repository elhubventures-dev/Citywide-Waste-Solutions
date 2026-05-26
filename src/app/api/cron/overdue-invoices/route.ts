import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPaymentReminderSms } from "@/lib/sms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Runs every Monday at 9:00 AM via Vercel Cron
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Find invoices pending for more than 30 days
  const overdueInvoices = await prisma.invoice.findMany({
    where: {
      status: "PENDING",
      createdAt: { lt: thirtyDaysAgo },
    },
  });

  if (overdueInvoices.length === 0) {
    return NextResponse.json({ success: true, message: "No overdue invoices", count: 0 });
  }

  const results = await Promise.allSettled(
    overdueInvoices.map(async (invoice) => {
      // Try to find phone via matching quote request
      const quote = await prisma.quoteRequest.findFirst({
        where: { email: invoice.customerEmail },
        orderBy: { createdAt: "desc" },
      });

      const dueDateStr = new Date(invoice.createdAt).toLocaleDateString("en-CA", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      if (quote?.phone && quote.smsOptIn) {
        await sendPaymentReminderSms(
          quote.phone,
          invoice.customerName.split(" ")[0],
          invoice.invoiceNumber,
          dueDateStr
        );
      }
    })
  );

  const sent = results.filter((r) => r.status === "fulfilled").length;

  console.log(`Overdue invoice reminders: ${sent}/${overdueInvoices.length} processed`);

  return NextResponse.json({
    success: true,
    overdueCount: overdueInvoices.length,
    processed: sent,
  });
}
