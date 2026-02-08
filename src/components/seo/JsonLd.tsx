import { companyInfo } from "@/lib/constants/company";
import { siteConfig } from "@/lib/config/site";
import { faqItems } from "@/lib/constants/faq";

interface JsonLdProps {
  type: "LocalBusiness" | "FAQPage";
}

export function JsonLd({ type }: JsonLdProps) {
  const baseUrl = siteConfig.url;

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${baseUrl}/#business`,
    name: "Flooring Bournemouth",
    alternateName: companyInfo.name,
    description: siteConfig.description,
    url: baseUrl,
    telephone: companyInfo.phone,
    email: companyInfo.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: companyInfo.address.street,
      addressLocality: companyInfo.address.city,
      addressRegion: companyInfo.address.county,
      postalCode: companyInfo.address.postcode,
      addressCountry: "GB",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 50.7192,
      longitude: -1.8808,
    },
    image: `${baseUrl}/images/og-home.jpg`,
    logo: `${baseUrl}/flooring_bournmouth_logo.png`,
    priceRange: "££",
    currenciesAccepted: "GBP",
    paymentAccepted: "Cash, Credit Card, Bank Transfer",
    areaServed: [
      { "@type": "City", name: "Bournemouth" },
      { "@type": "City", name: "Poole" },
      { "@type": "City", name: "Christchurch" },
      { "@type": "AdministrativeArea", name: "Dorset" },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "15:00",
      },
    ],
    sameAs: [
      siteConfig.social.facebook,
      siteConfig.social.instagram,
      siteConfig.social.google,
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "127",
      bestRating: "5",
      worstRating: "1",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Flooring Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Hardwood Flooring Installation",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Engineered Wood Flooring",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Laminate Flooring Installation",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Luxury Vinyl Tile (LVT) Fitting",
          },
        },
        {
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: "Tile and Stone Flooring" },
        },
        {
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: "Carpet Fitting" },
        },
      ],
    },
  };

  const faqPageSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const schemaMap = {
    LocalBusiness: localBusinessSchema,
    FAQPage: faqPageSchema,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMap[type]) }}
    />
  );
}
