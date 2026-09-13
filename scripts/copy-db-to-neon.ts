/**
 * Copy Prisma-mapped table data from a source Postgres (e.g. Supabase) to Neon.
 *
 * Requires:
 *   SOURCE_DATABASE_URL  — existing Supabase (or other) connection
 *   DATABASE_URL / DIRECT_URL — Neon target
 *
 * Usage:
 *   npx tsx scripts/copy-db-to-neon.ts
 *
 * Run `npm run db:push` against Neon first so the schema exists.
 */

import { config } from "dotenv";
import { resolve } from "path";
import { PrismaClient } from "@prisma/client";

config({ path: resolve(process.cwd(), ".env.local"), override: true });
config({ path: resolve(process.cwd(), ".env"), override: false });

async function main() {
  const sourceUrl = process.env.SOURCE_DATABASE_URL;
  const targetUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;

  if (!sourceUrl) {
    console.error("Set SOURCE_DATABASE_URL to the Supabase (source) connection string.");
    process.exit(1);
  }

  if (!targetUrl) {
    console.error("Set DATABASE_URL / DIRECT_URL to the Neon (target) connection string.");
    process.exit(1);
  }

  if (sourceUrl === targetUrl) {
    console.error("SOURCE_DATABASE_URL and target URL must be different.");
    process.exit(1);
  }

  const source = new PrismaClient({ datasources: { db: { url: sourceUrl } } });
  const target = new PrismaClient({ datasources: { db: { url: targetUrl } } });

  try {
    // Children first
    await target.invoiceActivity.deleteMany();
    await target.invoiceItem.deleteMany();
    await target.invoice.deleteMany();
    await target.pickupSchedule.deleteMany();
    await target.smsLog.deleteMany();
    await target.adminUser.deleteMany();
    await target.newsletterSubscriber.deleteMany();
    await target.contactSubmission.deleteMany();
    await target.quoteRequest.deleteMany();
    await target.client.deleteMany();

    const clients = await source.client.findMany();
    if (clients.length) {
      await target.client.createMany({ data: clients });
    }
    console.log(`clients: copied ${clients.length} rows`);

    const quotes = await source.quoteRequest.findMany();
    if (quotes.length) {
      await target.quoteRequest.createMany({ data: quotes });
    }
    console.log(`quote_requests: copied ${quotes.length} rows`);

    const contacts = await source.contactSubmission.findMany();
    if (contacts.length) {
      await target.contactSubmission.createMany({ data: contacts });
    }
    console.log(`contact_submissions: copied ${contacts.length} rows`);

    const newsletter = await source.newsletterSubscriber.findMany();
    if (newsletter.length) {
      await target.newsletterSubscriber.createMany({ data: newsletter });
    }
    console.log(`newsletter_subscribers: copied ${newsletter.length} rows`);

    const admins = await source.adminUser.findMany();
    if (admins.length) {
      await target.adminUser.createMany({ data: admins });
    }
    console.log(`admin_users: copied ${admins.length} rows`);

    const smsLogs = await source.smsLog.findMany();
    if (smsLogs.length) {
      await target.smsLog.createMany({ data: smsLogs });
    }
    console.log(`sms_logs: copied ${smsLogs.length} rows`);

    const pickups = await source.pickupSchedule.findMany();
    if (pickups.length) {
      await target.pickupSchedule.createMany({ data: pickups });
    }
    console.log(`pickup_schedules: copied ${pickups.length} rows`);

    const invoices = await source.invoice.findMany();
    if (invoices.length) {
      await target.invoice.createMany({ data: invoices });
    }
    console.log(`invoices: copied ${invoices.length} rows`);

    const items = await source.invoiceItem.findMany();
    if (items.length) {
      await target.invoiceItem.createMany({ data: items });
    }
    console.log(`invoice_items: copied ${items.length} rows`);

    const activities = await source.invoiceActivity.findMany();
    if (activities.length) {
      await target.invoiceActivity.createMany({ data: activities });
    }
    console.log(`invoice_activities: copied ${activities.length} rows`);

    console.log("Done.");
  } finally {
    await source.$disconnect();
    await target.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
