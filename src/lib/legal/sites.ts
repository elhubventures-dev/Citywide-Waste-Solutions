import { BUSINESS } from "@/lib/business";
import { MOVING_BUSINESS, RELOCATE_SITE_URL } from "@/lib/moving/business";

export const LEGAL_LAST_UPDATED = "July 7, 2026";

export const LEGAL_ENTITY = {
  name: BUSINESS.legalName,
  businessNumber: BUSINESS.businessNumber,
  bin: BUSINESS.bin,
  email: BUSINESS.email,
  phone: BUSINESS.phone,
  phoneRaw: BUSINESS.phoneRaw,
  address: BUSINESS.address.full,
} as const;

export const LEGAL_WEBSITES = {
  waste: {
    name: BUSINESS.name,
    url: BUSINESS.siteUrl,
    description: "waste collection, recycling, junk removal, dumpster rental, and related services",
  },
  moving: {
    name: MOVING_BUSINESS.name,
    url: RELOCATE_SITE_URL,
    description:
      "residential, commercial, and long-distance moving, packing, loading, unloading, and furniture assembly",
  },
  parent: MOVING_BUSINESS.parentName,
} as const;

export const LEGAL_WEBSITES_SCOPE = [
  `${LEGAL_ENTITY.name} operates ${LEGAL_WEBSITES.waste.name} at ${LEGAL_WEBSITES.waste.url} and ${LEGAL_WEBSITES.moving.name} at ${LEGAL_WEBSITES.moving.url}. Together, these websites are part of ${LEGAL_WEBSITES.parent}.`,
  `Unless a page states otherwise, references to "we," "us," or "our" in these legal documents apply to ${LEGAL_ENTITY.name} across both websites and the services offered through them.`,
] as const;
