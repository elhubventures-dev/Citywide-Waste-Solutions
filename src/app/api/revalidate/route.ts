import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";

export const runtime = "nodejs";

// Map Sanity document types to Next.js cache tags
const TYPE_TAG_MAP: Record<string, string[]> = {
  blogPost: ["blog", "blog-list"],
  blogCategory: ["blog", "categories"],
  service: ["services"],
  serviceArea: ["service-areas"],
  pricingTier: ["pricing"],
  testimonial: ["testimonials"],
  faq: ["faqs"],
  siteSettings: ["site-settings"],
};

export async function POST(req: NextRequest) {
  // Verify webhook secret
  const secret = req.headers.get("x-sanity-webhook-secret");
  if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { _type?: string; slug?: { current?: string } };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { _type, slug } = body;

  if (!_type) {
    return NextResponse.json({ error: "Missing _type" }, { status: 400 });
  }

  // Revalidate cache tags
  const tags = TYPE_TAG_MAP[_type] ?? [];
  for (const tag of tags) {
    revalidateTag(tag);
  }

  // Revalidate specific paths for blog posts
  if (_type === "blogPost" && slug?.current) {
    revalidatePath(`/blog/${slug.current}`);
    revalidatePath("/blog");
  }

  if (_type === "service" && body.slug) {
    revalidatePath(`/services/${body.slug}`);
  }

  if (_type === "serviceArea" && body.slug) {
    revalidatePath(`/service-areas/${body.slug}`);
  }

  console.log(`Revalidated: ${_type} — tags: [${tags.join(", ")}]`);

  return NextResponse.json({
    revalidated: true,
    type: _type,
    tags,
    now: new Date().toISOString(),
  });
}
