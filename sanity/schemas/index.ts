import { blogPostSchema } from "./blog-post";
import {
  authorSchema,
  blogCategorySchema,
  serviceSchema,
  serviceAreaSchema,
  pricingTierSchema,
  faqSchema,
  testimonialSchema,
  siteSettingsSchema,
} from "./other-schemas";

export const schemaTypes = [
  // Blog
  blogPostSchema,
  blogCategorySchema,
  authorSchema,
  // Core content
  serviceSchema,
  serviceAreaSchema,
  pricingTierSchema,
  faqSchema,
  testimonialSchema,
  // Singleton
  siteSettingsSchema,
];
