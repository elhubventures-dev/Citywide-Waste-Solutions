import {
  Trash2,
  Building2,
  Recycle,
  Container,
  PackageX,
  HardHat,
  type LucideIcon,
} from "lucide-react";

export const SERVICE_ICON_MAP: Record<string, LucideIcon> = {
  "residential-waste-collection": Trash2,
  "commercial-waste-management": Building2,
  "recycling-services": Recycle,
  "dumpster-bin-rental": Container,
  "junk-removal": PackageX,
  "construction-waste-removal": HardHat,
};

export function getServiceIcon(slug: string): LucideIcon {
  return SERVICE_ICON_MAP[slug] ?? Trash2;
}

/** Resolve icon from a /services/{slug} href */
export function getServiceIconFromHref(href: string): LucideIcon {
  const slug = href.split("/").filter(Boolean).pop() ?? "";
  return getServiceIcon(slug);
}
