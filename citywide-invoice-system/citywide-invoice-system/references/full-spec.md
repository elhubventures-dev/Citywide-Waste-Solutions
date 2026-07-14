# Invoice Management System — Full Feature Spec

Source of truth: the user's original "Master Prompt" document. Organized here by module so it can be worked through phase by phase rather than attempted as one giant undifferentiated build. Nothing here should be cut — it's all in-scope eventually — but see `## Delivery phases` at the bottom for sequencing, and the "⚠ needs real backend/credentials" flags for things that can't be faked convincingly.

## Admin Dashboard

Cards: Total invoices, Draft, Sent, Paid, Unpaid, Overdue, Revenue, Outstanding balance.
Recent invoices table (modern, sortable).

## Create Invoice page

**Client Information:** Company Name, Client Name, Phone, Email, Service Address, Billing Address, City, State, Country, ZIP, Tax Number, Notes.

**Invoice Details:** Invoice Number (auto-generated, editable), Issue Date, Due Date, Currency (default CAD), Tax Rate, Discount, Payment Terms, Status.

**Service Items** (dynamic unlimited rows): Service Name, Description, Qty, Unit, Price, Discount, Tax, Total. Row actions: Add / Duplicate / Delete. Rows auto-calculate.

**Service Library:** saved reusable services — seed with the real Citywide services (waste + moving, see `branding.md`), not generic placeholders. Multi-select supported.

**Price Calculator:** Subtotal, Tax, Discount, Grand Total, Outstanding Balance, Deposit, Amount Paid, Balance Due — all live-updating.

**Drafts:** Save Draft, Continue Later, Autosave every 30s, Recover/Edit/Delete Draft.

## PDF Invoice

Logo, company details, client details, invoice summary, service table, payment summary, terms, QR code, barcode, footer, watermark, signature area, A4 + US Letter optimized, proper page breaks, mobile-friendly rendering of the *portal* view (the PDF itself is fixed-layout by nature).
→ Use the `pdf` skill for generation mechanics once this phase is reached.

## Email System

Send to client / admin / optional CC/BCC, with PDF + quote/terms/brochure attachments. Responsive branded HTML email (logo, brand color `#1E3A5C`, CTA buttons: View Invoice / Pay Invoice / Download PDF). Delivery tracking: Opened, Clicked, Delivered, Failed, Bounced.
⚠ **Needs real backend + provider.** Actual sending/tracking requires an email provider (e.g. Resend, Postmark, SendGrid) and API keys the user must supply. Build the HTML template and the send-trigger UI now; wire the real API call once they pick a provider and give credentials. Don't fabricate a working send pipeline.

## Print

Print Preview, Print Invoice / Packing Slip / Receipt / Quote. Clean print CSS: hide nav/sidebar, proper `@media print` rules.

## Payment status & methods

Statuses: Draft, Pending, Sent, Viewed, Partially Paid, Paid, Cancelled, Refunded, Overdue — color-coded badges.
Methods: Stripe, PayPal, Square, Authorize.net, Bank Transfer, Cash, Cheque, Manual, Custom Gateway. Generate payment links.
⚠ **Needs real backend + credentials.** Actual charge processing requires the user's merchant accounts and API keys per gateway. Build the UI, the invoice-status state machine, and integration *hooks* (functions with clear TODO-free stubs that call out what config is required) — don't simulate a fake successful charge.

## Customer Portal

Open/download/print invoice, pay online, view payment + invoice history, Accept/Reject quote, Request revision.

## Search, Filters, Export, Import

Search by invoice #, client, company, email, phone, status, date, amount.
Filters: Today/Yesterday/Week/Month/Year, Paid/Unpaid/Draft/Overdue/Cancelled.
Export: CSV, Excel, PDF, JSON, XML. Import: CSV, Excel.

## UI requirements

Premium SaaS aesthetic: rounded cards, soft shadows, subtle glassmorphism where it fits, smooth transitions, loading skeletons, dark + light mode, accessible, responsive. Match the live site's navy (`#1E3A5C`) + clean/eco-conscious tone — see `branding.md`. No default Bootstrap look.

## Invoice template layout

Header (logo, invoice #, issue/due dates, status badge) → Client card + Company card → Service table → Payment summary → Notes/Terms → QR code → Signature → Footer (socials, contact, business numbers). CTAs: Pay Now, Download PDF, Print, Accept Quote, Request Revision.

## Database schema (once a backend is chosen)

Tables: Invoices, Invoice Items, Clients, Payments, Drafts, Services, Taxes, Discounts, Email Logs, Invoice Activity, Invoice Attachments, Payment History, Audit Logs. Normalize relationships (invoice → client, invoice → items, invoice → payments, etc).

## Security (once a backend is chosen)

Role-based access: Admin, Manager, Sales, Accountant, Customer. CSRF, XSS, SQL-injection protection, rate limiting, input validation/sanitization, audit trail, encryption at rest for sensitive fields.

## API

REST endpoints (GET/POST/PUT/DELETE/PATCH) for invoices, clients, payments, services. Structure so GraphQL could sit on top later without a rewrite.

## Notifications & automation

Toasts, email notifications, payment-received notifications, invoice-viewed notification.
Auto: generate invoice number, generate PDF, send email, update status, calculate totals, log activity, schedule reminders.

## Reminder schedule

3 days before due → due date → 3/7/14/30 days overdue. Admin gets copies. ⚠ needs a scheduled job (cron / queue) once backend exists.

## Activity timeline

Log every action: Created, Edited, Viewed, Downloaded, Printed, Sent, Paid, Cancelled.

## Reports

Revenue, invoices, outstanding, paid, taxes — monthly & yearly. Top customers, top services. Revenue-by-service-type breakdown (waste vs. moving vs. dumpster rental etc — maps to the two-brand structure). Charts, exportable.

## Extra business features (from the "additional enhancements" section)

- One-click Estimate/Quote → Invoice conversion.
- Digital customer approval (signature or Accept Quote button).
- Recurring invoices (for scheduled collection / ongoing commercial contracts).
- Multi-company branding — model this as **Citywide Waste Solutions** vs **Citywide Moving Solutions**, not a generic N-brand system.
- Region-based GST/HST/Sales Tax support (Ontario HST as default, configurable).
- File attachments: photos, weight tickets, contracts, permits, before/after images.
- Separate customer-facing notes vs internal admin notes.
- Unique invoice/payment links with optional expiration.
- Multi-currency/multi-language scaffolding for future expansion (CAD/en-CA as default).
- Dashboard analytics: revenue by service type, top clients, overdue accounts.

## Delivery phases (recommended sequencing — confirm with user, don't silently pick)

1. **Front-end Invoice Manager UI** — dashboard, create-invoice form with live calculator, service library, draft state (in-memory/local, not yet persisted server-side), invoice template component, print CSS. Fully working with mock/local data.
2. **PDF export** — wire the `pdf` skill to generate the branded invoice PDF from the same data model.
3. **Backend + DB** — pick a stack with the user (Next.js API routes + Postgres/Prisma is a sane default if they have no preference), implement schema, REST endpoints, persistence for drafts/invoices/clients/payments.
4. **Integrations** — email sending (provider + keys), payment gateways (merchant creds), reminders (cron/queue), RBAC/security hardening.

Do not promise phases 3–4 are "done" without the user's actual credentials/infra decisions — build the seams (clear function signatures, config placeholders documented as such) and say plainly what's needed to go live.
