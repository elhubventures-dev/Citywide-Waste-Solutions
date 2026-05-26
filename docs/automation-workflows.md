# Citywide Waste Solutions — Automation Workflows

## Overview

All automation is split across two layers:

1. **In-app** — runs directly in Next.js API routes (Twilio SMS, Resend email, Prisma DB, GHL CRM sync)
2. **External** — Zapier or Make.com for more complex multi-step flows

---

## Flow 1: Quote Form Submission

```
Customer submits form
  │
  ├─► [API /api/quote]
  │     ├─ Rate limit check (Upstash)
  │     ├─ Zod validation
  │     ├─ reCAPTCHA v3 verify
  │     ├─ Prisma → QuoteRequest created (status: NEW)
  │     └─ Promise.allSettled (parallel):
  │           ├─ Resend → Customer confirmation email
  │           ├─ Resend → Admin notification email
  │           ├─ Twilio SMS → Customer (if smsOptIn=true)
  │           └─ GoHighLevel → Upsert contact + add to pipeline
  │
  └─► [Zapier Zap: "New Quote Lead"]
        Trigger: Webhook (POST from API after DB save)
        Steps:
          1. Formatter → Split fullName into firstName/lastName
          2. GHL → Find or create contact
          3. GHL → Add to "New Leads" pipeline stage
          4. Slack → Post to #leads channel
          5. Gmail → Send admin digest (batched, daily 9am)
```

---

## Flow 2: Pickup Scheduling (Admin triggers)

```
Admin marks quote as "Scheduled" in admin panel
  │
  ├─► [API /api/admin/schedule]
  │     ├─ Create PickupSchedule record in DB
  │     ├─ Twilio → sendPickupScheduledSms()
  │     └─ Resend → Pickup confirmation email
  │
  └─► [Zapier Zap: "Pickup Scheduled"]
        Trigger: Webhook from admin panel
        Steps:
          1. Google Calendar → Create event for driver
          2. GHL → Move contact to "Scheduled" pipeline stage
          3. Twilio → Day-before reminder (scheduled 6pm prior evening)
```

---

## Flow 3: Pickup Day Reminder (Scheduled)

```
[Zapier Schedule: Daily 6:00 PM]
  │
  ├─ Supabase → Query pickups scheduled for tomorrow
  │     SELECT * FROM pickup_schedules
  │     WHERE scheduled_date = CURRENT_DATE + 1
  │     AND is_completed = false
  │
  └─ For each pickup:
        Twilio → sendPickupReminderSms()
        Resend → Pickup reminder email
```

---

## Flow 4: Pickup Completion

```
Driver marks pickup complete (mobile app / admin panel)
  │
  ├─► [API /api/admin/pickups/:id/complete]
  │     ├─ Update PickupSchedule → is_completed: true
  │     ├─ Twilio → sendPickupCompletedSms()
  │     └─ Resend → Completion + review request email
  │
  └─► [Zapier]
        GHL → Move to "Completed" stage
        Google Sheets → Log completed job
```

---

## Flow 5: Invoice Payment

```
Customer visits /pay
  │
  ├─ Enters invoice # + email
  ├─ [API /api/stripe/create-payment-intent]
  │     ├─ Lookup invoice in DB
  │     ├─ Verify email matches
  │     └─ Stripe → Create PaymentIntent
  │
  ├─ Customer completes payment via Stripe Elements
  │
  └─► [Stripe Webhook → /api/stripe/webhook]
        Event: payment_intent.succeeded
          ├─ Prisma → Invoice.status = COMPLETED
          ├─ Resend → Payment confirmation email
          ├─ Twilio → Payment SMS (if smsOptIn)
          └─ [Zapier]
                GHL → Update contact with payment tag
                QuickBooks (optional) → Mark invoice paid
```

---

## Flow 6: Overdue Invoice Reminder

```
[Zapier Schedule: Weekly Monday 9:00 AM]
  │
  ├─ Supabase → Query overdue invoices
  │     SELECT * FROM invoices
  │     WHERE status = 'PENDING'
  │     AND created_at < NOW() - INTERVAL '30 days'
  │
  └─ For each overdue invoice:
        Resend → Friendly payment reminder email
        Twilio → sendPaymentReminderSms() (if phone available)
        GHL → Tag contact as "Overdue"
```

---

## Flow 7: Newsletter Welcome

```
Subscriber signs up (footer or blog widget)
  │
  ├─ [API /api/newsletter]
  │     └─ Prisma → NewsletterSubscriber upsert
  │
  └─► [Zapier]
        Trigger: Webhook
        Steps:
          1. MailerLite / GHL Email → Add to "Blog Subscribers" list
          2. GHL Email → Welcome sequence (3-email drip):
               Day 0: Welcome + recycling guide PDF
               Day 3: Service overview
               Day 7: Seasonal tips article
```

---

## Make.com Scenario: Monthly Report

```
[Schedule: 1st of every month]
  │
  ├─ Supabase → Pull last 30 days:
  │     - Total quote requests
  │     - Conversion rate (quoted → scheduled)
  │     - Revenue collected (invoices paid)
  │     - SMS delivery rates
  │
  ├─ Google Sheets → Append to dashboard sheet
  │
  └─ Gmail → Send monthly summary to owner
```

---

## Zapier Zap Setup Guide

### Zap 1: Quote Form → GHL + Slack

1. **Trigger**: Webhooks by Zapier (Catch Hook)
   - Copy webhook URL → paste into `/api/quote` route's `ZAPIER_QUOTE_WEBHOOK_URL` env var

2. **Action 1**: GoHighLevel — Create/Update Contact
   - Map: `email`, `phone`, `firstName`, `lastName`, `tags`

3. **Action 2**: GoHighLevel — Add to Pipeline
   - Pipeline: "Website Leads"
   - Stage: "New Quote"

4. **Action 3**: Slack — Send Channel Message
   - Channel: `#leads`
   - Message: `🔔 New {{serviceType}} quote from {{fullName}} in {{city}}`

---

## Environment Variables for Automations

```bash
# Twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxx
TWILIO_AUTH_TOKEN=xxxx
TWILIO_PHONE_NUMBER=+19050000000

# GHL CRM
GHL_API_KEY=xxxx
GHL_LOCATION_ID=xxxx
GHL_PIPELINE_ID=xxxx
GHL_STAGE_NEW_LEAD_ID=xxxx
GHL_STAGE_SCHEDULED_ID=xxxx
GHL_STAGE_COMPLETED_ID=xxxx

# Zapier webhooks
ZAPIER_QUOTE_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/xxx/yyy
ZAPIER_SCHEDULE_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/xxx/zzz

# Stripe
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```
