import type { MetadataRoute } from "next"
import { getPosts, getProducts } from "@/lib/api"
import { SITE_URL } from "@/lib/config"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, posts] = await Promise.all([getProducts(), getPosts()])
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/catalog`, changeFrequency: "weekly", priority: 0.9 },
    ...products.map((p) => ({ url: `${SITE_URL}/catalog/${p.slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.6 },
    ...posts.map((p) => ({ url: `${SITE_URL}/blog/${p.slug}`, lastModified: p.publishedAt, priority: 0.5 })),
  ]
}
