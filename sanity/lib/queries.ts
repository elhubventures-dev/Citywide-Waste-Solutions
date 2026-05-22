import { groq } from "next-sanity";

// ─── Fragments ─────────────────────────────────────────────────────────────────

const imageFields = groq`
  asset->{ _id, url, metadata { dimensions, lqip } },
  alt,
  caption
`;

const authorFields = groq`
  _id,
  name,
  bio,
  "avatar": avatar { ${imageFields} }
`;

const categoryFields = groq`
  _id,
  "slug": slug.current,
  label,
  color
`;

// ─── Blog Queries ─────────────────────────────────────────────────────────────

/** All published posts — list view */
export const allBlogPostsQuery = groq`
  *[_type == "blogPost" && defined(slug.current) && !(_id in path("drafts.**"))]
  | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    "coverImage": coverImage { ${imageFields} },
    publishedAt,
    "author": author->{ ${authorFields} },
    "categories": categories[]->{ ${categoryFields} },
    "readingTime": round(length(pt::text(body)) / 5 / 200)
  }
`;

/** Posts filtered by category */
export const blogPostsByCategoryQuery = groq`
  *[_type == "blogPost"
    && defined(slug.current)
    && !(_id in path("drafts.**"))
    && $categorySlug in categories[]->slug.current
  ]
  | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    "coverImage": coverImage { ${imageFields} },
    publishedAt,
    "author": author->{ ${authorFields} },
    "categories": categories[]->{ ${categoryFields} },
    "readingTime": round(length(pt::text(body)) / 5 / 200)
  }
`;

/** Single post by slug — full content */
export const blogPostBySlugQuery = groq`
  *[_type == "blogPost" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    body,
    "coverImage": coverImage { ${imageFields} },
    publishedAt,
    _updatedAt,
    "author": author->{ ${authorFields} },
    "categories": categories[]->{ ${categoryFields} },
    "readingTime": round(length(pt::text(body)) / 5 / 200),
    seo {
      metaTitle,
      metaDescription,
      "ogImage": ogImage { ${imageFields} }
    }
  }
`;

/** Related posts (same category, exclude current) */
export const relatedPostsQuery = groq`
  *[_type == "blogPost"
    && slug.current != $currentSlug
    && !(_id in path("drafts.**"))
    && count((categories[]->slug.current)[@ in $categories]) > 0
  ]
  | order(publishedAt desc)
  [0...3] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    "coverImage": coverImage { ${imageFields} },
    publishedAt,
    "categories": categories[]->{ ${categoryFields} }
  }
`;

/** All blog post slugs — for static generation */
export const allBlogSlugsQuery = groq`
  *[_type == "blogPost" && defined(slug.current) && !(_id in path("drafts.**"))].slug.current
`;

/** All categories */
export const allCategoriesQuery = groq`
  *[_type == "blogCategory"] | order(label asc) {
    _id,
    "slug": slug.current,
    label,
    color
  }
`;

// ─── Services ─────────────────────────────────────────────────────────────────

export const allServicesQuery = groq`
  *[_type == "service"] | order(order asc) {
    _id,
    slug,
    title,
    shortTitle,
    description,
    longDescription,
    price,
    features,
    "heroImage": heroImage { ${imageFields} },
    "faqs": faqs[]->{ _id, question, answer }
  }
`;

export const serviceBySlugQuery = groq`
  *[_type == "service" && slug == $slug][0] {
    _id,
    slug,
    title,
    shortTitle,
    description,
    longDescription,
    price,
    features,
    "heroImage": heroImage { ${imageFields} },
    "faqs": faqs[]->{ _id, question, answer },
    seo { metaTitle, metaDescription }
  }
`;

// ─── Service Areas ────────────────────────────────────────────────────────────

export const allServiceAreasQuery = groq`
  *[_type == "serviceArea"] | order(name asc) {
    _id,
    slug,
    name,
    description,
    population,
    coords,
    "heroImage": heroImage { ${imageFields} },
    localSeoContent,
    "faqs": faqs[]->{ _id, question, answer }
  }
`;

export const serviceAreaBySlugQuery = groq`
  *[_type == "serviceArea" && slug == $slug][0] {
    _id,
    slug,
    name,
    description,
    population,
    coords,
    "heroImage": heroImage { ${imageFields} },
    localSeoContent,
    "faqs": faqs[]->{ _id, question, answer },
    seo { metaTitle, metaDescription }
  }
`;

// ─── Pricing ──────────────────────────────────────────────────────────────────

export const allPricingQuery = groq`
  *[_type == "pricingTier"] | order(order asc) {
    _id,
    name,
    price,
    period,
    description,
    features,
    isFeatured,
    color,
    ctaLabel,
    ctaHref
  }
`;

// ─── Testimonials ─────────────────────────────────────────────────────────────

export const allTestimonialsQuery = groq`
  *[_type == "testimonial" && isPublished] | order(_createdAt desc) {
    _id,
    name,
    role,
    rating,
    text,
    "avatar": avatar { ${imageFields} }
  }
`;

// ─── FAQs ─────────────────────────────────────────────────────────────────────

export const faqsByServiceQuery = groq`
  *[_type == "faq" && $serviceSlug in services[]] | order(order asc) {
    _id,
    question,
    answer
  }
`;

export const allGeneralFaqsQuery = groq`
  *[_type == "faq" && isGeneral] | order(order asc) {
    _id,
    question,
    answer
  }
`;

// ─── Site Settings ────────────────────────────────────────────────────────────

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    siteName,
    tagline,
    phone,
    email,
    address,
    socialLinks
  }
`;
