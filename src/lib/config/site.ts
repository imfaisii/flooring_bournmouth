export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "Bournemouth Flooring",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  description:
    "Professional flooring installation, repair, and supply services in Bournemouth. Hardwood, laminate, vinyl, tile, and carpet solutions for residential and commercial spaces.",
  company: {
    phone: process.env.NEXT_PUBLIC_COMPANY_PHONE || "(01202) 000-000",
    email: "info@flooringbournemouth.co.uk",
    address: "123 High Street, Bournemouth, Dorset, BH1 1AA",
    hours: {
      weekday: "8:00 AM - 6:00 PM",
      saturday: "9:00 AM - 3:00 PM",
      sunday: "Closed",
    },
  },
  social: {
    facebook: "https://facebook.com/flooringbournemouth",
    instagram: "https://instagram.com/flooringbournemouth",
    google: "https://g.page/flooringbournemouth",
  },
} as const;
