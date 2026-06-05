import manifest from "./gallery-manifest.json";

export type GalleryCategory =
  | "all"
  | "services"
  | "marketing"
  | "brand"
  | "showcase";

export interface GalleryImage {
  slug: string;
  src: string;
  width: number;
  height: number;
  title: string;
  category: GalleryCategory;
  description: string;
}

const CATEGORY_LABELS: Record<Exclude<GalleryCategory, "all">, string> = {
  services: "Services",
  marketing: "Marketing",
  brand: "Brand Identity",
  showcase: "Showcase",
};

/** Map flyer filenames to display metadata */
function metaForSource(sourceFile: string): Pick<GalleryImage, "title" | "category" | "description"> {
  const upper = sourceFile.toUpperCase();

  if (upper.includes("BEFORE") && upper.includes("AFTER")) {
    return {
      title: sourceFile.replace(/\.[^.]+$/, ""),
      category: "showcase",
      description: "Before-and-after cleanup results from Citywide Waste Solutions projects.",
    };
  }
  if (upper.includes("RESIDENTIAL")) {
    return {
      title: "Residential Services",
      category: "services",
      description: "Curbside and household waste collection for Ontario homes.",
    };
  }
  if (upper.includes("COMMERCIAL")) {
    return {
      title: "Commercial Services",
      category: "services",
      description: "Scalable waste management for offices, retail, and industrial sites.",
    };
  }
  if (upper.includes("RECYCLING")) {
    return {
      title: "Recycling Services",
      category: "services",
      description: "Multi-stream recycling programs for paper, plastics, metals, and more.",
    };
  }
  if (upper.includes("ORGANIC")) {
    return {
      title: "Organic Waste Management",
      category: "services",
      description: "Composting and organic waste diversion for greener communities.",
    };
  }
  if (upper.includes("CONSTRUCTION")) {
    return {
      title: "Construction Cleanup",
      category: "services",
      description: "Debris removal and site cleanup for renovation and construction projects.",
    };
  }
  if (upper.includes("FLEET WRAP") || upper.includes("CORPORATE") || upper.includes("MASTER BRAND")) {
    return {
      title: sourceFile.replace(/\.[^.]+$/, ""),
      category: "brand",
      description: "Brand identity, fleet branding, and corporate visual assets.",
    };
  }
  if (
    upper.includes("SOCIAL") ||
    upper.includes("CINEMATIC") ||
    upper.includes("CALL-TO-ACTION") ||
    upper.includes("WEBSITE HERO")
  ) {
    return {
      title: sourceFile.replace(/\.[^.]+$/, ""),
      category: "marketing",
      description: "Campaign creatives, banners, and promotional designs.",
    };
  }

  return {
    title: sourceFile.replace(/\.[^.]+$/, ""),
    category: "marketing",
    description: "Citywide Waste Solutions marketing and brand creative.",
  };
}

type ManifestEntry = {
  slug: string;
  src: string;
  width: number;
  height: number;
  sourceFile: string;
};

export const GALLERY_IMAGES: GalleryImage[] = (manifest as ManifestEntry[]).map((entry) => {
  const meta = metaForSource(entry.sourceFile);
  return {
    slug: entry.slug,
    src: entry.src,
    width: entry.width,
    height: entry.height,
    ...meta,
  };
});

export const GALLERY_CATEGORIES: { id: GalleryCategory; label: string }[] = [
  { id: "all", label: "All" },
  ...(
    Object.entries(CATEGORY_LABELS) as [Exclude<GalleryCategory, "all">, string][]
  ).map(([id, label]) => ({ id, label })),
];

export function getGalleryImages(category: GalleryCategory = "all"): GalleryImage[] {
  if (category === "all") return GALLERY_IMAGES;
  return GALLERY_IMAGES.filter((img) => img.category === category);
}
