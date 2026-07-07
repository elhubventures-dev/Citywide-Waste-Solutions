import { BUSINESS as WASTE_BUSINESS } from "@/lib/business";

/** Citywide Moving Solutions — relocate subdomain */
export const RELOCATE_SITE_URL = "https://relocate.citywidewastesolutions.com";

export const MOVING_BUSINESS = {
  name: "Citywide Moving Solutions",
  parentName: "Citywide Waste & Moving Solutions",
  legalName: WASTE_BUSINESS.legalName,
  shortName: "Citywide Moving",
  tagline: "Cleaner City. Better Tomorrow.",
  headline: "We Move Your World",
  siteUrl: RELOCATE_SITE_URL,
  mainSiteUrl: WASTE_BUSINESS.siteUrl,
  phone: WASTE_BUSINESS.phone,
  phoneRaw: WASTE_BUSINESS.phoneRaw,
  email: WASTE_BUSINESS.email,
  address: WASTE_BUSINESS.address,
  hours: WASTE_BUSINESS.hours,
  social: WASTE_BUSINESS.social,
  coords: WASTE_BUSINESS.coords,
} as const;
