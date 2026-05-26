import { StructureBuilder } from "sanity/desk";
import {
  FileText,
  Settings,
  Newspaper,
  Briefcase,
  MapPin,
  DollarSign,
  Users,
  Tag,
} from "lucide-react";

export const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title("Content")
    .items([
      // ── Singleton: Site Settings ─────────────────────────────────────
      S.listItem()
        .title("Site Settings")
        .icon(Settings)
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),

      S.divider(),

      // ── Blog ────────────────────────────────────────────────────────
      S.listItem()
        .title("Blog Posts")
        .icon(Newspaper)
        .child(S.documentTypeList("blogPost").title("All Posts")),

      S.listItem()
        .title("Blog Categories")
        .icon(Tag)
        .child(S.documentTypeList("blogCategory").title("Categories")),

      S.listItem()
        .title("Authors")
        .icon(Users)
        .child(S.documentTypeList("author").title("Authors")),

      S.divider(),

      // ── Services ────────────────────────────────────────────────────
      S.listItem()
        .title("Services")
        .icon(Briefcase)
        .child(S.documentTypeList("service").title("All Services")),

      // ── Service Areas ───────────────────────────────────────────────
      S.listItem()
        .title("Service Areas")
        .icon(MapPin)
        .child(S.documentTypeList("serviceArea").title("All Areas")),

      // ── Pricing ─────────────────────────────────────────────────────
      S.listItem()
        .title("Pricing Tiers")
        .icon(DollarSign)
        .child(S.documentTypeList("pricingTier").title("Pricing")),

      S.divider(),

      // ── FAQs ────────────────────────────────────────────────────────
      S.listItem().title("FAQs").icon(FileText).child(S.documentTypeList("faq").title("All FAQs")),

      // ── Testimonials ────────────────────────────────────────────────
      S.listItem()
        .title("Testimonials")
        .icon(Users)
        .child(S.documentTypeList("testimonial").title("Testimonials")),
    ]);
