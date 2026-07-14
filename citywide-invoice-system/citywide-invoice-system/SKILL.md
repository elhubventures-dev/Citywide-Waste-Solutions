---
name: citywide-invoice-system
description: Build, extend, or discuss the Invoice Management System for Citywide Waste Solutions (citywidewastesolutions.com) and its sister brand Citywide Moving Solutions (relocate.citywidewastesolutions.com). Use this whenever the user mentions invoices, billing, invoice manager, invoice dashboard, quotes/estimates, payment tracking, or the invoice module for this specific business — even if they just say "add invoicing to my site," "build the invoice thing we talked about," or reference the invoice project without naming the company. This is the user's own long-running project spec; always consult it before improvising a generic invoicing build.
---

# Citywide Invoice System Builder

This skill turns the user's original giant "master prompt" into an actionable, phased build for a real invoice/billing module for their waste-and-moving business. The master prompt describes an entire enterprise SaaS product in one shot (live payments, live email delivery tracking, full RBAC backend, etc.) — that's the north star, not a one-message deliverable. Your job is to make real progress toward it every time this triggers, without pretending unbuilt integrations already work.

## Before writing any code

1. **Read `references/branding.md`** for the real logo URLs, brand color (`#1E3A5C`), business numbers, contact info, service list, and stack signals (Next.js). Use these facts directly in templates instead of placeholder text/colors.
2. **Read `references/full-spec.md`** for the full feature checklist organized by module, plus the recommended delivery-phase order.
3. Check what's already been built in this conversation/repo (if the user has files from a previous session). Don't restart from scratch if a dashboard/form/template already exists — extend it.
4. If this is a fresh start, briefly confirm scope with the user rather than assuming: which phase are we doing (UI only vs. PDF vs. backend vs. integrations)? Do they have a backend/DB already, or is this greenfield? Default assumption if they don't know: Next.js API routes + Postgres/Prisma, and say that's the assumption.

## Also load

- `frontend-design` skill before building any UI — this needs to look like a premium, brand-native SaaS panel, not default Bootstrap/shadcn defaults.
- `pdf` skill when the work reaches PDF invoice generation.
- `docx`/`xlsx` skills only if the user specifically wants Word/Excel export/import of invoices.

## How to scope each request

Treat every incoming request as "make real progress on the phase we're in," per `full-spec.md`'s phase list:

1. Front-end Invoice Manager UI (dashboard, create-invoice form, live calculator, service library, in-memory drafts, invoice template, print CSS) — buildable fully today with mock data, no backend needed.
2. PDF export of the branded invoice.
3. Backend + database (schema, REST endpoints, persistence).
4. Integrations (real email sending, real payment gateways, scheduled reminders, RBAC/security hardening) — these need the user's actual accounts/API keys.

If the user asks for "the complete system" in one message, don't silently attempt to fabricate phases 3–4 as if they're live and working — build everything you *can* build for real (phase 1–2 fully, phase 3 as schema/endpoint code, phase 4 as clearly-labeled integration stubs with a short list of what credentials/decisions are needed to finish them), and say plainly what's stubbed vs. live.

## Output conventions

- Code-heavy responses → create actual files (React components, API routes, SQL/Prisma schema), not just descriptions. This is a "give me working code" skill per the user's stated preference.
- Match brand color `#1E3A5C` and the real Citywide/Citywide Moving logos/contact details everywhere a template needs them — never leave "Your Company Name" style placeholders.
- Default currency CAD, default tax model = configurable Ontario HST, default locale en-CA.
- When a feature needs something only the user can provide (API keys, merchant account, DNS for email sending domain, etc.), say so explicitly and briefly rather than glossing over it.
