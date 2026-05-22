import { defineType, defineField } from "sanity";

// ─── Author ───────────────────────────────────────────────────────────────────
export const authorSchema = defineType({
  name:  "author",
  title: "Author",
  type:  "document",
  fields: [
    defineField({ name: "name",   title: "Name",   type: "string",
      validation: (R) => R.required() }),
    defineField({ name: "bio",    title: "Bio",    type: "text", rows: 3 }),
    defineField({ name: "avatar", title: "Avatar", type: "image",
      options: { hotspot: true } }),
  ],
  preview: {
    select: { title: "name", media: "avatar" },
  },
});

// ─── Blog Category ────────────────────────────────────────────────────────────
export const blogCategorySchema = defineType({
  name:  "blogCategory",
  title: "Blog Category",
  type:  "document",
  fields: [
    defineField({ name: "label", title: "Label", type: "string",
      validation: (R) => R.required() }),
    defineField({ name: "slug",  title: "Slug",  type: "slug",
      options: { source: "label" }, validation: (R) => R.required() }),
    defineField({
      name:    "color",
      title:   "Badge Color",
      type:    "string",
      options: { list: ["green", "blue", "earth", "gray"], layout: "radio" },
      initialValue: "green",
    }),
    defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
  ],
  preview: {
    select: { title: "label" },
  },
});

// ─── Service ──────────────────────────────────────────────────────────────────
export const serviceSchema = defineType({
  name:  "service",
  title: "Service",
  type:  "document",
  fields: [
    defineField({ name: "title",       title: "Title",       type: "string",
      validation: (R) => R.required() }),
    defineField({ name: "shortTitle",  title: "Short Title", type: "string",
      validation: (R) => R.required().max(20) }),
    defineField({
      name:    "slug",
      title:   "Slug",
      type:    "string",
      options: {
        list: [
          { title: "Residential Waste Collection", value: "residential-waste-collection" },
          { title: "Commercial Waste Management",  value: "commercial-waste-management" },
          { title: "Recycling Services",           value: "recycling-services" },
          { title: "Dumpster & Bin Rental",        value: "dumpster-bin-rental" },
          { title: "Junk Removal",                 value: "junk-removal" },
          { title: "Construction Waste Removal",   value: "construction-waste-removal" },
        ],
      },
      validation: (R) => R.required(),
    }),
    defineField({ name: "description",     title: "Short Description",
      type: "text",  rows: 3, validation: (R) => R.required().max(300) }),
    defineField({ name: "longDescription", title: "Full Page Content",
      type: "array",
      of: [{ type: "block" }, { type: "image", options: { hotspot: true } }] }),
    defineField({ name: "price",    title: "Price Display (e.g. From $30/month)",
      type: "string" }),
    defineField({ name: "features", title: "Key Features",
      type: "array", of: [{ type: "string" }] }),
    defineField({ name: "heroImage", title: "Hero Image",
      type: "image", options: { hotspot: true },
      fields: [{ name: "alt", title: "Alt Text", type: "string" }] }),
    defineField({ name: "faqs",  title: "FAQs",
      type: "array", of: [{ type: "reference", to: [{ type: "faq" }] }] }),
    defineField({ name: "order", title: "Display Order",
      type: "number", initialValue: 0 }),
    defineField({
      name: "seo", title: "SEO", type: "object",
      fields: [
        { name: "metaTitle",       title: "Meta Title",       type: "string" },
        { name: "metaDescription", title: "Meta Description", type: "text" },
      ],
      options: { collapsible: true, collapsed: true },
    }),
  ],
  orderings: [{ title: "Order", name: "order",
    by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "title", media: "heroImage" },
  },
});

// ─── Service Area ─────────────────────────────────────────────────────────────
export const serviceAreaSchema = defineType({
  name:  "serviceArea",
  title: "Service Area",
  type:  "document",
  fields: [
    defineField({ name: "name",  title: "City Name",  type: "string",
      validation: (R) => R.required() }),
    defineField({ name: "slug",  title: "Slug",
      type: "string",
      options: { list: ["vaughan","toronto","brampton","mississauga","courtice"] },
      validation: (R) => R.required() }),
    defineField({ name: "description",  title: "Short Description",
      type: "text",  rows: 3 }),
    defineField({ name: "population",   title: "Population (e.g. 350,000+)",
      type: "string" }),
    defineField({
      name:  "coords",
      title: "Coordinates",
      type:  "object",
      fields: [
        { name: "lat", title: "Latitude",  type: "number" },
        { name: "lng", title: "Longitude", type: "number" },
      ],
    }),
    defineField({ name: "heroImage",    title: "Hero Image",
      type: "image", options: { hotspot: true },
      fields: [{ name: "alt", title: "Alt Text", type: "string" }] }),
    defineField({
      name:    "localSeoContent",
      title:   "Local SEO Content",
      description: "Unique city-specific content for local SEO (500–800 words recommended)",
      type:    "array",
      of:      [{ type: "block" }],
    }),
    defineField({ name: "faqs",  title: "City-Specific FAQs",
      type: "array", of: [{ type: "reference", to: [{ type: "faq" }] }] }),
    defineField({
      name: "seo", title: "SEO", type: "object",
      fields: [
        { name: "metaTitle",       type: "string" },
        { name: "metaDescription", type: "text"   },
      ],
      options: { collapsible: true, collapsed: true },
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "slug" },
  },
});

// ─── Pricing Tier ─────────────────────────────────────────────────────────────
export const pricingTierSchema = defineType({
  name:  "pricingTier",
  title: "Pricing Tier",
  type:  "document",
  fields: [
    defineField({ name: "name",        title: "Plan Name",  type: "string",
      validation: (R) => R.required() }),
    defineField({ name: "price",       title: "Price (number)", type: "number" }),
    defineField({ name: "period",      title: "Period (e.g. /month, starting)",
      type: "string" }),
    defineField({ name: "description", title: "Short Description", type: "text", rows: 2 }),
    defineField({ name: "features",    title: "Features",
      type: "array", of: [{ type: "string" }] }),
    defineField({ name: "isFeatured",  title: "Featured / Highlighted?",
      type: "boolean", initialValue: false }),
    defineField({
      name: "color", title: "Color Theme", type: "string",
      options: { list: ["green","blue","earth"], layout: "radio" },
      initialValue: "green",
    }),
    defineField({ name: "ctaLabel", title: "CTA Button Label", type: "string",
      initialValue: "Get Started" }),
    defineField({ name: "ctaHref",  title: "CTA Button Link",  type: "string",
      initialValue: "/contact#quote" }),
    defineField({ name: "order",    title: "Display Order",     type: "number",
      initialValue: 0 }),
  ],
  orderings: [{ title: "Order", name: "order",
    by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "name", subtitle: "price" },
    prepare({ title, subtitle }) {
      return { title, subtitle: subtitle ? `$${subtitle}` : "Custom" };
    },
  },
});

// ─── FAQ ──────────────────────────────────────────────────────────────────────
export const faqSchema = defineType({
  name:  "faq",
  title: "FAQ",
  type:  "document",
  fields: [
    defineField({ name: "question",  title: "Question", type: "string",
      validation: (R) => R.required() }),
    defineField({ name: "answer",    title: "Answer",   type: "text", rows: 4,
      validation: (R) => R.required() }),
    defineField({
      name:    "services",
      title:   "Applicable Services",
      description: "Which service pages should this FAQ appear on?",
      type:    "array",
      of:      [{ type: "string" }],
      options: {
        list: [
          "residential-waste-collection",
          "commercial-waste-management",
          "recycling-services",
          "dumpster-bin-rental",
          "junk-removal",
          "construction-waste-removal",
          "general",
        ],
      },
    }),
    defineField({ name: "isGeneral", title: "Show on General FAQ page?",
      type: "boolean", initialValue: false }),
    defineField({ name: "order",     title: "Display Order",
      type: "number", initialValue: 0 }),
  ],
  preview: {
    select: { title: "question" },
  },
});

// ─── Testimonial ──────────────────────────────────────────────────────────────
export const testimonialSchema = defineType({
  name:  "testimonial",
  title: "Testimonial",
  type:  "document",
  fields: [
    defineField({ name: "name",        title: "Customer Name", type: "string",
      validation: (R) => R.required() }),
    defineField({ name: "role",        title: "Role / Location (e.g. Homeowner, Vaughan)",
      type: "string" }),
    defineField({
      name: "rating", title: "Star Rating", type: "number",
      options: { list: [1,2,3,4,5] }, initialValue: 5,
      validation: (R) => R.required().min(1).max(5),
    }),
    defineField({ name: "text",        title: "Review Text", type: "text", rows: 4,
      validation: (R) => R.required().min(40).max(400) }),
    defineField({ name: "avatar",      title: "Photo", type: "image",
      options: { hotspot: true } }),
    defineField({ name: "isPublished", title: "Published?", type: "boolean",
      initialValue: true }),
  ],
  preview: {
    select: { title: "name", subtitle: "rating", media: "avatar" },
    prepare({ title, subtitle, media }) {
      return { title, subtitle: "★".repeat(subtitle ?? 5), media };
    },
  },
});

// ─── Site Settings (singleton) ────────────────────────────────────────────────
export const siteSettingsSchema = defineType({
  name:  "siteSettings",
  title: "Site Settings",
  type:  "document",
  fields: [
    defineField({ name: "siteName", title: "Site Name", type: "string" }),
    defineField({ name: "tagline",  title: "Tagline",   type: "string" }),
    defineField({ name: "phone",    title: "Phone",     type: "string" }),
    defineField({ name: "email",    title: "Email",     type: "string" }),
    defineField({
      name:  "address",
      title: "Address",
      type:  "object",
      fields: [
        { name: "street",   title: "Street",   type: "string" },
        { name: "city",     title: "City",     type: "string" },
        { name: "province", title: "Province", type: "string" },
        { name: "postal",   title: "Postal",   type: "string" },
      ],
    }),
    defineField({
      name:  "socialLinks",
      title: "Social Links",
      type:  "object",
      fields: [
        { name: "facebook",  title: "Facebook URL",  type: "url" },
        { name: "instagram", title: "Instagram URL", type: "url" },
        { name: "linkedin",  title: "LinkedIn URL",  type: "url" },
      ],
    }),
    defineField({
      name:  "announcementBanner",
      title: "Announcement Banner",
      type:  "object",
      fields: [
        { name: "isActive", title: "Show banner?",    type: "boolean", initialValue: false },
        { name: "text",     title: "Banner Text",     type: "string" },
        { name: "link",     title: "Banner Link URL", type: "url" },
      ],
      options: { collapsible: true },
    }),
  ],
  preview: {
    select: { title: "siteName" },
  },
});
