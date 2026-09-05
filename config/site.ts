/**
 * Site Configuration
 * Centralized site metadata, SEO tags, links, and branding details.
 */

export const siteConfig = {
  name: "Droply",
  shortName: "Droply",
  description:
    "High-performance cloud file storage and folder management platform built with Next.js 16, React 19, Tailwind CSS v4, Docker PostgreSQL 16, and ImageKit CDN.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ogImage: "/og-image.png",
  links: {
    github: "https://github.com/vedant2863/Droply-File-Storage-App",
    documentation:
      "https://github.com/vedant2863/Droply-File-Storage-App#readme",
  },
  creator: "Vedant",
  authors: [
    {
      name: "Vedant",
      url: "https://github.com/vedant2863",
    },
  ],
  keywords: [
    "Droply",
    "Cloud Storage",
    "File Manager",
    "Folder Hierarchy",
    "Next.js 16",
    "React 19",
    "Tailwind CSS v4",
    "PostgreSQL",
    "Drizzle ORM",
    "ImageKit CDN",
    "JSZip Archiving",
    "JWT Authentication",
  ],
  themeColor: "#2563eb",
  backgroundColor: "#090d16",
};

export type SiteConfig = typeof siteConfig;

export default siteConfig;
