import { MetadataRoute } from "next";
import { getCategories } from "@/lib/api/products.server";
import { getBrands } from "@/lib/api/brands.server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://peshawartraders.com";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/brands`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/cart`, lastModified: new Date(), changeFrequency: "never", priority: 0.3 },
    { url: `${baseUrl}/track-order`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
  ];

  let brandRoutes: MetadataRoute.Sitemap = [];
  let categoryRoutes: MetadataRoute.Sitemap = [];

  try {
    const [brands, categories] = await Promise.all([
      getBrands(),
      getCategories(),
    ]);

    brandRoutes = (brands || []).map((b: any) => ({
      url: `${baseUrl}/brands/${b.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    categoryRoutes = (categories || []).map((c: any) => ({
      url: `${baseUrl}/products?category=${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.6,
    }));
  } catch {
    // If DB unavailable, just serve static routes
  }

  return [...staticRoutes, ...brandRoutes, ...categoryRoutes];
}
