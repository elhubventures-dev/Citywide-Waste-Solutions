import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { GoogleAnalytics } from "@/components/layout/google-analytics";
import { BUSINESS, SITE_URL } from "@/lib/constants";

// ─── Font ───────────────────────────────────────────────────────────────────
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
  preload: true,
});

// ─── Metadata ───────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BUSINESS.name} | Reliable Waste Collection in Ontario`,
    template: `%s | ${BUSINESS.name}`,
  },
  description:
    "Professional waste collection, recycling, junk removal & dumpster rental across Ontario — Durham, Scarborough, Vaughan & Toronto. Get a free quote today.",
  keywords: [
    "waste collection Ontario",
    "junk removal Toronto",
    "dumpster rental Vaughan",
    "recycling services Durham",
    "waste management Scarborough",
    "construction waste removal Ontario",
    "commercial waste management Ontario",
  ],
  authors: [{ name: BUSINESS.name }],
  creator: BUSINESS.name,
  publisher: BUSINESS.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: SITE_URL,
    siteName: BUSINESS.name,
    title: "Reliable Waste Collection & Recycling Services in Ontario",
    description:
      "Professional waste collection, recycling, junk removal & dumpster rental across Ontario. Serving Durham, Scarborough, Vaughan & Toronto.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${BUSINESS.name} — Ontario Waste Management`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${BUSINESS.name} | Ontario Waste Collection`,
    description:
      "Professional waste collection, recycling & junk removal across Ontario. Get your free quote today.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    other: [{ rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#2E9B4A" }],
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: SITE_URL,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2E9B4A" },
    { media: "(prefers-color-scheme: dark)", color: "#1E3A5C" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// ─── JSON-LD — Local Business Schema ────────────────────────────────────────
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/#organization`,
  name: BUSINESS.name,
  description:
    "Professional waste collection, recycling, junk removal and dumpster rental services across Ontario, Canada.",
  url: SITE_URL,
  telephone: BUSINESS.phoneRaw,
  email: BUSINESS.email,
  founder: {
    "@type": "Person",
    name: BUSINESS.owner,
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: BUSINESS.address.street,
    addressLocality: BUSINESS.address.city,
    addressRegion: "ON",
    postalCode: BUSINESS.address.postal,
    addressCountry: "CA",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 43.9167,
    longitude: -78.7667,
  },
  areaServed: [
    { "@type": "City", name: "Vaughan" },
    { "@type": "City", name: "Toronto" },
    ],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "07:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "08:00",
      closes: "14:00",
    },
  ],
  sameAs: [BUSINESS.social.facebook, BUSINESS.social.instagram, BUSINESS.social.linkedin],
  priceRange: "$$",
  currenciesAccepted: "CAD",
  paymentAccepted: "Cash, Credit Card, Debit Card, Online Payment",
  serviceType: [
    "Residential Waste Collection",
    "Commercial Waste Management",
    "Recycling Services",
    "Dumpster Rental",
    "Junk Removal",
    "Construction Waste Removal",
  ],
  image: `${SITE_URL}/og-image.jpg`,
};

// ─── Root Layout ─────────────────────────────────────────────────────────────
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-CA" suppressHydrationWarning>
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {/* Preconnect to external origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://maps.googleapis.com" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
      </head>
      <body
        className={cn(plusJakarta.variable, "min-h-screen bg-background font-sans antialiased")}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {/* Skip to main content — accessibility */}
          <a
            href="#main-content"
            className="btn-primary sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[999]"
          >
            Skip to main content
          </a>

          {/* Main app shell */}
          <div className="flex min-h-screen flex-col">
            {/* Header is added per page via (site) layout */}
            <main id="main-content" className="flex-1">
              {children}
            </main>
          </div>

          <Toaster />
        </ThemeProvider>

        {/* Google Analytics — loaded after hydration */}
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID ?? ""} />
      </body>
    </html>
  );
}
