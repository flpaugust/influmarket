import type { MetadataRoute } from "next";
import { getAllNicheSlugs, getAllNicheCityPairs } from "@/services/seoData";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://influmarket.com.br";
  const currentDate = new Date();

  // Static core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/hub`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cadastro`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // 15 Programmatic Niche Directory Routes
  const nicheRoutes: MetadataRoute.Sitemap = getAllNicheSlugs().map((slug) => ({
    url: `${baseUrl}/influenciadores-de-${slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Top Programmatic Niche + City Routes
  const nicheCityRoutes: MetadataRoute.Sitemap = getAllNicheCityPairs().map(
    ({ nicho, cidade }) => ({
      url: `${baseUrl}/${nicho}-em-${cidade}`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.7,
    })
  );

  return [...staticRoutes, ...nicheRoutes, ...nicheCityRoutes];
}
