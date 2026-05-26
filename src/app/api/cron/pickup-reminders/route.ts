import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPickupReminderSms } from "@/lib/sms";
import { sendPaymentReminderSms } from "@/lib/sms";
import { sendContactAdminNotification } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Vercel Cron calls this daily at 6:00 PM (Eastern)
// Schedule defined in vercel.json: "0 18 * * *"
export async function GET(req: NextRequest) {
  // Verify the request is from Vercel Cron
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStart = new Date(tomorrow.setHours(0, 0, 0, 0));
  const tomorrowEnd = new Date(tomorrow.setHours(23, 59, 59, 999));

  // Find all pickups scheduled for tomorrow
  const pickups = await prisma.pickupSchedule.findMany({
    where: {
      scheduledDate: { gte: tomorrowStart, lte: tomorrowEnd },
      isCompleted: false,
    },
  });

  const results = await Promise.allSettled(
    pickups.map(async (pickup) => {
      const firstName = pickup.customerName.split(" ")[0];
      const dateStr = tomorrowStart.toLocaleDateString("en-CA", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });

      await sendPickupReminderSms(
        pickup.phone,
        firstName,
        pickup.serviceType.replace(/_/g, " "),
        dateStr
      );
    })
  );

  const sent = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;

  console.log(`Pickup reminders: ${sent} sent, ${failed} failed`);

  return NextResponse.json({
    success: true,
    pickupsFound: pickups.length,
    sent,
    failed,
    date: tomorrowStart.toISOString(),
  });
}
