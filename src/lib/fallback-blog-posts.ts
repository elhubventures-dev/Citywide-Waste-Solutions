import { SITE_IMAGES } from "@/lib/site-images";
import { RELOCATE_SITE_URL } from "@/lib/moving/business";
import { MOVING_SERVICE_AREAS_LINE } from "@/lib/moving/constants";

type Block = {
  _type: "block";
  _key: string;
  style: "normal" | "h2" | "h3";
  markDefs: [];
  children: Array<{
    _type: "span";
    _key: string;
    text: string;
    marks: string[];
  }>;
};

type CtaBlock = {
  _type: "cta";
  _key: string;
  title?: string;
  description?: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

function block(_key: string, style: Block["style"], text: string): Block {
  return {
    _type: "block",
    _key,
    style,
    markDefs: [],
    children: [{ _type: "span", _key: `${_key}-span`, text, marks: [] }],
  };
}

function cta(
  _key: string,
  options: Omit<CtaBlock, "_type" | "_key">
): CtaBlock {
  return { _type: "cta", _key, ...options };
}

export const fallbackBlogCategories = [
  { _id: "fallback-category-recycling", slug: "recycling-tips", label: "Recycling Tips" },
  { _id: "fallback-category-waste", slug: "waste-reduction", label: "Waste Reduction" },
  { _id: "fallback-category-community", slug: "community-cleanup", label: "Community Cleanup" },
  { _id: "fallback-category-moving", slug: "moving-services", label: "Moving Services" },
] as const;

export const fallbackAuthor = {
  _id: "fallback-author-citywide",
  name: "Citywide Waste Solutions",
  bio: "Ontario waste collection and recycling specialists serving Durham, Clarington, Toronto, Scarborough & Vaughan, and surrounding communities.",
};

export const fallbackBlogPosts = [
  {
    _id: "fallback-moving-relocate",
    title: "Introducing Citywide Moving Solutions — Your Trusted Team, Now for Relocations",
    slug: "introducing-citywide-moving-solutions-relocate",
    excerpt:
      "Citywide Waste Solutions has launched Citywide Moving Solutions at relocate.citywidewastesolutions.com — professional residential and commercial moving across Durham, Clarington, Toronto, Scarborough, and Vaughan.",
    localImage: SITE_IMAGES.fleet.van,
    coverImage: {
      alt: "Citywide Moving Solutions branded van serving the Greater Toronto Area",
    },
    publishedAt: "2026-07-07",
    _updatedAt: "2026-07-07",
    readingTime: 5,
    author: fallbackAuthor,
    categories: [fallbackBlogCategories[3]],
    seo: {
      metaTitle: "Introducing Citywide Moving Solutions | relocate.citywidewastesolutions.com",
      metaDescription:
        "Citywide Moving Solutions is now live on relocate.citywidewastesolutions.com. Learn about our residential, commercial, and long-distance moving services across the GTA and Durham Region.",
    },
    body: [
      block(
        "moving-intro",
        "normal",
        "If you already trust Citywide Waste Solutions for pickup, recycling, junk removal, and bin rental, we have good news: the same professional, reliable team now helps homes and businesses move across the Greater Toronto Area and Durham Region through Citywide Moving Solutions."
      ),
      block(
        "moving-launch",
        "normal",
        `Our dedicated moving website is live at relocate.citywidewastesolutions.com. It is built for people who need clear quotes, straightforward service information, and the same accountability you expect from Citywide — whether you are moving across town or planning a larger relocation.`
      ),
      cta("moving-cta-top", {
        title: "Explore Citywide Moving Solutions",
        description:
          "Visit our new moving site for services, pricing, FAQs, and a free quote form — all in one place.",
        primaryLabel: "Visit Moving Website",
        primaryHref: RELOCATE_SITE_URL,
        secondaryLabel: "Get Free Moving Quote",
        secondaryHref: `${RELOCATE_SITE_URL}/contact`,
      }),
      block("moving-why-title", "h2", "Why we launched a dedicated moving site"),
      block(
        "moving-why",
        "normal",
        "Waste collection and moving are different jobs with different planning needs. A move involves packing timelines, crew sizing, furniture protection, elevator access, and delivery windows — details that deserve their own space, forms, and service pages."
      ),
      block(
        "moving-why-two",
        "normal",
        "The relocate subdomain keeps moving information organized while staying connected to Citywide Waste & Moving Solutions. You get a focused experience for relocations without losing the brand trust we have built since 2014."
      ),
      block("moving-services-title", "h2", "What you can book through relocate.citywidewastesolutions.com"),
      block(
        "moving-services",
        "normal",
        "Citywide Moving Solutions offers residential moves, commercial and office relocations, long-distance moving, packing and unpacking, loading and unloading, and furniture assembly. Whether you need a full-service move or help with the heavy lifting only, our crew can tailor the job to your timeline and budget."
      ),
      block("moving-areas-title", "h2", "Where we serve"),
      block(
        "moving-areas",
        "normal",
        `We provide moving services across ${MOVING_SERVICE_AREAS_LINE}, and surrounding Ontario communities. Long-distance moves are also available — request a quote and our team will confirm crew size, truck needs, and scheduling.`
      ),
      block("moving-trust-title", "h2", "The same standards you already know"),
      block(
        "moving-trust",
        "normal",
        "Citywide Moving Solutions is fully insured, on time, and built around clear communication from quote to delivery. That is the same approach we bring to waste collection: show up when expected, handle the job carefully, and leave the property in better shape than we found it."
      ),
      cta("moving-cta-mid", {
        title: "Planning a move this season?",
        description:
          "Tell us about your move online or call our team for a written estimate — no obligation.",
        primaryLabel: "Request a Free Quote",
        primaryHref: `${RELOCATE_SITE_URL}/contact#quote`,
        secondaryLabel: "View Moving Services",
        secondaryHref: `${RELOCATE_SITE_URL}/services`,
      }),
      block("moving-how-title", "h2", "How to get started"),
      block(
        "moving-how-one",
        "normal",
        "1. Visit relocate.citywidewastesolutions.com and review the services that match your move."
      ),
      block(
        "moving-how-two",
        "normal",
        "2. Submit the quote form with your move date, addresses, and property details — or call us directly for faster scheduling."
      ),
      block(
        "moving-how-three",
        "normal",
        "3. We confirm pricing, crew size, and timing before moving day so there are no surprises."
      ),
      block("moving-wrap-title", "h2", "Waste and moving, one trusted local team"),
      block(
        "moving-wrap",
        "normal",
        "Need waste pickup for a cleanout before your move? You can still request waste services here on citywidewastesolutions.com. For relocations, packing, and delivery, head to our moving site — we are ready to help you get there."
      ),
      cta("moving-cta-bottom", {
        title: "Ready when you are",
        description: "Citywide Moving Solutions is live and taking quote requests today.",
        primaryLabel: "Go to Citywide Moving Solutions",
        primaryHref: RELOCATE_SITE_URL,
        secondaryLabel: "Contact Moving Team",
        secondaryHref: `${RELOCATE_SITE_URL}/contact`,
      }),
    ],
  },
  {
    _id: "fallback-household-waste",
    title: "10 Practical Ways to Reduce Household Waste in Ontario",
    slug: "how-to-reduce-household-waste-ontario",
    excerpt:
      "Small changes at home can make a big impact on Ontario's recycling targets. Start with simple habits that reduce garbage, improve sorting, and keep more material out of landfill.",
    localImage: SITE_IMAGES.blog.recycling,
    coverImage: {
      alt: "Citywide Waste Solutions branded green recycling bin",
    },
    publishedAt: "2024-11-15",
    _updatedAt: "2024-11-15",
    readingTime: 4,
    author: fallbackAuthor,
    categories: [fallbackBlogCategories[0]],
    seo: {
      metaTitle: "10 Practical Ways to Reduce Household Waste in Ontario",
      metaDescription:
        "Learn practical ways Ontario households can reduce garbage, improve recycling, compost better, and prepare waste for cleaner collection.",
    },
    body: [
      block(
        "household-intro",
        "normal",
        "Reducing household waste does not require a complete lifestyle overhaul. For most Ontario homes, the biggest gains come from small repeatable habits: buying only what will be used, separating materials correctly, and keeping recyclable or reusable items out of the garbage stream."
      ),
      block(
        "household-why",
        "normal",
        "At Citywide Waste Solutions, we see the same pattern across residential pickups: a large share of household garbage is made up of packaging, food scraps, paper products, and items that could have been donated, repaired, composted, or recycled."
      ),
      block("household-plan-title", "h2", "Start with a simple home waste audit"),
      block(
        "household-plan",
        "normal",
        "For one week, pay attention to what fills your garbage bags fastest. Is it food waste, takeout containers, cardboard, bathroom products, or old household items? Once you know the source, it becomes much easier to reduce the volume."
      ),
      block("household-tip-one-title", "h2", "1. Sort recyclables before they reach the bin"),
      block(
        "household-tip-one",
        "normal",
        "Create a small sorting area near the kitchen or garage for cardboard, paper, metal cans, glass, and accepted plastics. Rinse containers quickly and flatten boxes so recycling takes up less space and is easier to collect."
      ),
      block("household-tip-two-title", "h2", "2. Compost food scraps where possible"),
      block(
        "household-tip-two",
        "normal",
        "Fruit peels, vegetable scraps, coffee grounds, tea bags, eggshells, and many yard materials can usually be diverted from garbage. If your municipality offers organics collection, use it consistently. If not, consider a backyard composter where suitable."
      ),
      block("household-tip-three-title", "h2", "3. Reduce packaging at the point of purchase"),
      block(
        "household-tip-three",
        "normal",
        "Choose refillable, reusable, or bulk options when they make sense. Buying concentrated cleaning products, larger pantry staples, and products with recyclable packaging can reduce weekly garbage without sacrificing convenience."
      ),
      block("household-tip-four-title", "h2", "4. Donate before disposal"),
      block(
        "household-tip-four",
        "normal",
        "Furniture, clothing, small appliances, toys, and renovation leftovers may still be useful to someone else. Donation and reuse should be considered before booking a junk removal pickup."
      ),
      block("household-tip-five-title", "h2", "5. Schedule bulky item removal responsibly"),
      block(
        "household-tip-five",
        "normal",
        "Large items should not be left outside indefinitely. If you are clearing a basement, garage, or rental unit, schedule a pickup window and identify items that may require special handling, such as electronics, appliances, mattresses, or construction debris."
      ),
      block("household-wrap-title", "h2", "Cleaner homes start with consistent habits"),
      block(
        "household-wrap",
        "normal",
        "The goal is not perfection. The goal is to reduce avoidable waste, improve sorting, and make collection safer and cleaner. If your household needs help with junk removal, bin rental, or recurring pickup, Citywide Waste Solutions can help you choose the right service."
      ),
    ],
  },
  {
    _id: "fallback-construction-debris",
    title: "The Complete Guide to Construction Debris Disposal in Ontario",
    slug: "construction-debris-disposal-ontario-guide",
    excerpt:
      "Renovation and construction projects create heavy, mixed debris. Learn what can be recycled, what needs special handling, and how to keep your job site compliant.",
    localImage: SITE_IMAGES.blog.commercial,
    coverImage: {
      alt: "Citywide Waste Solutions green waste collection truck",
    },
    publishedAt: "2024-11-08",
    _updatedAt: "2024-11-08",
    readingTime: 6,
    author: fallbackAuthor,
    categories: [fallbackBlogCategories[1]],
    seo: {
      metaTitle: "Construction Debris Disposal Guide for Ontario Projects",
      metaDescription:
        "A practical guide to disposing of renovation debris, construction waste, wood, drywall, concrete, metal, and mixed materials in Ontario.",
    },
    body: [
      block(
        "construction-intro",
        "normal",
        "Construction and renovation projects can generate a surprising amount of material in a short period of time. Wood, drywall, tile, concrete, metal, cardboard, fixtures, and packaging all need to be handled correctly to keep the site safe and avoid unnecessary landfill waste."
      ),
      block(
        "construction-risk",
        "normal",
        "The best disposal plan starts before demolition begins. Knowing what materials will be removed, how much space is available for a bin, and whether there are access restrictions helps prevent delays and extra hauling costs."
      ),
      block("construction-materials-title", "h2", "Know what type of debris you have"),
      block(
        "construction-materials",
        "normal",
        "Clean wood, scrap metal, cardboard, concrete, brick, and certain fixtures may be recyclable or reusable. Mixed renovation debris often requires sorting before disposal. Hazardous or regulated materials require separate handling and should never be mixed into a standard construction bin."
      ),
      block("construction-bin-title", "h2", "Choose the right bin size"),
      block(
        "construction-bin",
        "normal",
        "A bin that is too small leads to extra pickups, while a bin that is too large can take up valuable site space. For small bathroom or kitchen renovations, a smaller bin may be enough. Larger demolition, roofing, or multi-room projects often need a larger container and a clear pickup schedule."
      ),
      block("construction-safety-title", "h2", "Keep the job site safe and accessible"),
      block(
        "construction-safety",
        "normal",
        "Place bins on stable ground where crews and equipment can access them safely. Avoid blocking sidewalks, hydrants, driveways, or emergency access. Keep sharp materials contained and avoid overfilling above the container line."
      ),
      block("construction-sorting-title", "h2", "Separate high-value recyclable materials"),
      block(
        "construction-sorting",
        "normal",
        "Metal, clean cardboard, concrete, brick, and untreated wood are often easier to divert when they are separated early. Sorting at the source can reduce contamination and improve the chance that material is recovered."
      ),
      block("construction-call-title", "h2", "When to call a professional hauler"),
      block(
        "construction-call",
        "normal",
        "If your project includes heavy debris, limited access, time-sensitive cleanup, or mixed materials, a professional waste partner can help you avoid multiple dump runs and keep the site moving. Citywide Waste Solutions supports contractors, property managers, and homeowners across Ontario with bin rental and construction debris removal."
      ),
    ],
  },
  {
    _id: "fallback-community-cleanup",
    title: "How Durham and Scarborough Led Ontario's Cleanest Community Initiative",
    slug: "courtice-brampton-community-cleanup-2024",
    excerpt:
      "Community cleanups work best when local residents, businesses, and waste teams coordinate. See how organized collection can divert material and improve neighbourhood pride.",
    localImage: SITE_IMAGES.blog.community,
    coverImage: {
      alt: "Citywide Waste Solutions branded service van in Ontario",
    },
    publishedAt: "2024-10-28",
    _updatedAt: "2024-10-28",
    readingTime: 3,
    author: fallbackAuthor,
    categories: [fallbackBlogCategories[2]],
    seo: {
      metaTitle: "Community Cleanup Lessons from Durham and Scarborough",
      metaDescription:
        "How Ontario communities can organize cleaner neighbourhood events with better waste sorting, pickup coordination, and diversion planning.",
    },
    body: [
      block(
        "community-intro",
        "normal",
        "A successful community cleanup is more than a few garbage bags and a weekend announcement. The best events combine clear planning, safe collection points, proper sorting, and a reliable pickup partner who can move material quickly."
      ),
      block(
        "community-local",
        "normal",
        "Durham and Scarborough show how neighbourhood pride can turn into practical environmental action. When residents understand what to collect, where to place it, and how materials will be handled, participation increases and contamination decreases."
      ),
      block("community-planning-title", "h2", "Start with zones and collection points"),
      block(
        "community-planning",
        "normal",
        "Divide the cleanup area into manageable zones such as parks, plazas, school routes, residential streets, or commercial strips. Assign clear collection points so volunteers do not leave bags scattered across the neighbourhood."
      ),
      block("community-sorting-title", "h2", "Separate recyclables from garbage"),
      block(
        "community-sorting",
        "normal",
        "Provide separate bags or containers for recyclables, landfill waste, scrap metal, and bulky items where possible. This makes pickup faster and helps prevent recyclable material from being lost in mixed garbage."
      ),
      block("community-safety-title", "h2", "Put safety first"),
      block(
        "community-safety",
        "normal",
        "Volunteers should avoid needles, chemicals, sharp metal, unknown liquids, and heavy items. These should be reported and handled by trained crews with proper equipment."
      ),
      block("community-business-title", "h2", "Invite local businesses to participate"),
      block(
        "community-business",
        "normal",
        "Businesses can provide supplies, promote the event, sponsor bins, or help with refreshments. Their participation also helps keep commercial areas cleaner after the event ends."
      ),
      block("community-wrap-title", "h2", "Cleaner communities need follow-through"),
      block(
        "community-wrap",
        "normal",
        "A cleanup day is a strong start, but lasting results come from regular pickup schedules, accessible disposal options, and clear communication. Citywide Waste Solutions helps Ontario communities, property teams, and businesses plan collection that keeps public spaces cleaner."
      ),
    ],
  },
];

export function getFallbackBlogPost(slug: string) {
  return fallbackBlogPosts.find((post) => post.slug === slug) ?? null;
}

export function getFallbackRelatedPosts(currentSlug: string, categorySlugs: string[]) {
  return fallbackBlogPosts
    .filter((post) => post.slug !== currentSlug)
    .filter((post) => post.categories.some((category) => categorySlugs.includes(category.slug)))
    .slice(0, 3);
}
