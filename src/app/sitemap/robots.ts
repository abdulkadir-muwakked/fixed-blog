/**
 * @File: src/app/sitemap/robots.ts
 */

import { MetadataRoute } from "next";

// This generates the robots.txt file for the application
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/api/"],
    },
    sitemap: "https://o9med.vercel.app/sitemap.xml",
  };
}
