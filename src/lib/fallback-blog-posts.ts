import { SITE_IMAGES } from "@/lib/site-images";

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

function block(_key: string, style: Block["style"], text: string): Block {
  return {
    _type: "block",
    _key,
    style,
    markDefs: [],
    children: [{ _type: "span", _key: `${_key}-span`, text, marks: [] }],
  };
}

export const fallbackBlogCategories = [
  { _id: "fallback-category-recycling", slug: "recycling-tips", label: "Recycling Tips" },
  { _id: "fallback-category-waste", slug: "waste-reduction", label: "Waste Reduction" },
  { _id: "fallback-category-community", slug: "community-cleanup", label: "Community Cleanup" },
] as const;

export const fallbackAuthor = {
  _id: "fallback-author-citywide",
  name: "Citywide Waste Solutions",
  bio: "Ontario waste collection and recycling specialists serving Vaughan, Toronto, Brampton, Mississauga, Courtice, and surrounding communities.",
};

export const fallbackBlogPosts = [
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
    title: "How Courtice & Brampton Led Ontario's Cleanest Community Initiative",
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
      metaTitle: "Community Cleanup Lessons from Courtice and Brampton",
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
        "Courtice and Brampton show how neighbourhood pride can turn into practical environmental action. When residents understand what to collect, where to place it, and how materials will be handled, participation increases and contamination decreases."
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
