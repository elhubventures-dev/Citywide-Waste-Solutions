/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://www.citywidewastesolutions.com",
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: ["/admin", "/api", "/_next"] },
    ],
    additionalSitemaps: [
      "https://www.citywidewastesolutions.com/server-sitemap.xml", // for dynamic blog pages
    ],
  },
  exclude: ["/admin/*", "/api/*"],
  changefreq: "weekly",
  priority: 0.7,
  sitemapSize: 5000,
  additionalPaths: async (config) => {
    const services = [
      "residential-waste-collection",
      "commercial-waste-management",
      "recycling-services",
      "dumpster-bin-rental",
      "junk-removal",
      "construction-waste-removal",
    ];
    const areas = ["vaughan", "toronto", "brampton", "mississauga", "courtice"];

    return [
      ...services.map((s) => ({
        loc: `/services/${s}`,
        changefreq: "monthly",
        priority: 0.8,
        lastmod: new Date().toISOString(),
      })),
      ...areas.map((a) => ({
        loc: `/service-areas/${a}`,
        changefreq: "monthly",
        priority: 0.8,
        lastmod: new Date().toISOString(),
      })),
    ];
  },
};
