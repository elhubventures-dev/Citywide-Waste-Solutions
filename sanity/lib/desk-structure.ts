import { StructureBuilder } from "sanity/desk";

export const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title("Content")
    .items([
      // ── Singleton: Site Settings ─────────────────────────────────────
      S.listItem()
        .title("Site Settings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),

      S.divider(),

      // ── Blog ────────────────────────────────────────────────────────
      S.listItem().title("Blog Posts").child(S.documentTypeList("blogPost").title("All Posts")),

      S.listItem()
        .title("Blog Categories")
        .child(S.documentTypeList("blogCategory").title("Categories")),

      S.listItem().title("Authors").child(S.documentTypeList("author").title("Authors")),

      S.divider(),

      // ── Services ────────────────────────────────────────────────────
      S.listItem().title("Services").child(S.documentTypeList("service").title("All Services")),

      // ── Service Areas ───────────────────────────────────────────────
      S.listItem()
        .title("Service Areas")
        .child(S.documentTypeList("serviceArea").title("All Areas")),

      // ── Pricing ─────────────────────────────────────────────────────
      S.listItem().title("Pricing Tiers").child(S.documentTypeList("pricingTier").title("Pricing")),

      S.divider(),

      // ── FAQs ────────────────────────────────────────────────────────
      S.listItem().title("FAQs").child(S.documentTypeList("faq").title("All FAQs")),

      // ── Testimonials ────────────────────────────────────────────────
      S.listItem()
        .title("Testimonials")
        .child(S.documentTypeList("testimonial").title("Testimonials")),
    ]);
