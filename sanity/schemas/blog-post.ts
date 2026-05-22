import { defineType, defineField } from "sanity";

export const blogPostSchema = defineType({
  name:  "blogPost",
  title: "Blog Post",
  type:  "document",
  icon: () => "📝",

  fields: [
    defineField({
      name:       "title",
      title:      "Title",
      type:       "string",
      validation: (R) => R.required().min(10).max(100),
    }),

    defineField({
      name:    "slug",
      title:   "Slug",
      type:    "slug",
      options: { source: "title", maxLength: 96 },
      validation: (R) => R.required(),
    }),

    defineField({
      name:       "excerpt",
      title:      "Excerpt",
      type:       "text",
      rows:       3,
      description: "Short summary shown on blog listings and social shares (120–160 chars)",
      validation: (R) => R.required().min(80).max(200),
    }),

    defineField({
      name:    "coverImage",
      title:   "Cover Image",
      type:    "image",
      options: { hotspot: true },
      fields: [
        { name: "alt", title: "Alt Text", type: "string",
          description: "Describe the image for screen readers and SEO" },
        { name: "caption", title: "Caption", type: "string" },
      ],
      validation: (R) => R.required(),
    }),

    defineField({
      name:    "author",
      title:   "Author",
      type:    "reference",
      to:      [{ type: "author" }],
      validation: (R) => R.required(),
    }),

    defineField({
      name:    "categories",
      title:   "Categories",
      type:    "array",
      of:      [{ type: "reference", to: [{ type: "blogCategory" }] }],
      validation: (R) => R.required().min(1),
    }),

    defineField({
      name:        "publishedAt",
      title:       "Published At",
      type:        "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (R) => R.required(),
    }),

    defineField({
      name:  "body",
      title: "Body Content",
      type:  "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal",      value: "normal" },
            { title: "Heading 2",   value: "h2" },
            { title: "Heading 3",   value: "h3" },
            { title: "Heading 4",   value: "h4" },
            { title: "Quote",       value: "blockquote" },
          ],
          lists: [
            { title: "Bullet",   value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Bold",          value: "strong" },
              { title: "Italic",        value: "em" },
              { title: "Underline",     value: "underline" },
              { title: "Strike",        value: "strike-through" },
              { title: "Code",          value: "code" },
            ],
            annotations: [
              {
                name:  "link",
                type:  "object",
                title: "Link",
                fields: [
                  { name: "href",     type: "url",     title: "URL",
                    validation: (R: any) => R.uri({ allowRelative: true }) },
                  { name: "blank",    type: "boolean", title: "Open in new tab",
                    initialValue: false },
                ],
              },
            ],
          },
        },
        // Image block
        {
          type:    "image",
          options: { hotspot: true },
          fields: [
            { name: "alt",     title: "Alt Text", type: "string" },
            { name: "caption", title: "Caption",  type: "string" },
          ],
        },
        // Callout block
        {
          name:  "callout",
          type:  "object",
          title: "Callout Box",
          fields: [
            { name: "type",    title: "Type",    type: "string",
              options: { list: ["info", "tip", "warning", "success"] }, initialValue: "tip" },
            { name: "text",    title: "Content", type: "text" },
          ],
        },
      ],
      validation: (R) => R.required(),
    }),

    // ── SEO ─────────────────────────────────────────────────────────────
    defineField({
      name:  "seo",
      title: "SEO",
      type:  "object",
      fields: [
        { name: "metaTitle",       title: "Meta Title (overrides post title)",
          type: "string",  validation: (R: any) => R.max(70) },
        { name: "metaDescription", title: "Meta Description (overrides excerpt)",
          type: "text",    validation: (R: any) => R.max(160) },
        { name: "ogImage",         title: "OG Image (overrides cover image)",
          type: "image",   options: { hotspot: true } },
      ],
      options: { collapsible: true, collapsed: true },
    }),
  ],

  preview: {
    select: {
      title:  "title",
      author: "author.name",
      media:  "coverImage",
    },
    prepare({ title, author, media }) {
      return { title, subtitle: author ? `By ${author}` : "No author", media };
    },
  },

  orderings: [
    { title: "Newest first",  name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }] },
    { title: "Oldest first",  name: "publishedAtAsc",
      by: [{ field: "publishedAt", direction: "asc" }] },
  ],
});
