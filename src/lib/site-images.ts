/**
 * Public image paths — all photos synced from Images/Mockups via `npm run images:sync`.
 * Logos synced from Images/Logo/logo.png.
 */
export const SITE_IMAGES = {
  logos: {
    header: "/images/logos/logo-header.png",
    light: "/images/logos/logo-light.png",
    dark: "/images/logos/logo-dark.png",
    footer: "/images/logos/logo-footer.png",
    onGreen: "/images/logos/logo-on-green.png",
  },
  hero: {
    /** Branded service van — Toronto skyline (homepage hero) */
    main: "/images/hero/hero-main.jpg",
    /** Green truck — faded background on inner page heroes */
    pageBanner: "/images/hero/page-banner.jpg",
    /** Flyer reference — CALL-TO-ACTION BANNERS */
    ctaFlyer: "/images/hero/cta-banner-flyer.png",
  },
  fleet: {
    van: "/images/fleet/branded-van.jpg",
    truck: "/images/fleet/branded-truck.jpg",
    wrap: "/images/fleet/fleet-wrap-mockup.png",
    dumpster: "/images/fleet/branded-dumpster.jpg",
    bin: "/images/fleet/branded-bin.jpg",
  },
  about: {
    beforeAfter: "/images/about/before-after-cleanup.jpg",
  },
  blog: {
    recycling: "/images/blog/recycling-toronto.jpg",
    commercial: "/images/blog/commercial-fleet.jpg",
    community: "/images/blog/community-cleanup.jpg",
  },
} as const;

/** All mockup-backed photo paths (for validation / reuse). */
export const MOCKUP_IMAGE_PATHS = [
  SITE_IMAGES.hero.main,
  SITE_IMAGES.hero.pageBanner,
  SITE_IMAGES.fleet.van,
  SITE_IMAGES.fleet.truck,
  SITE_IMAGES.fleet.wrap,
  SITE_IMAGES.fleet.dumpster,
  SITE_IMAGES.fleet.bin,
  SITE_IMAGES.about.beforeAfter,
  SITE_IMAGES.blog.recycling,
  SITE_IMAGES.blog.commercial,
  SITE_IMAGES.blog.community,
] as const;
