// Серверные запросы к бэкенду. Кэш Next.js с тегами: бэкенд сбрасывает его через /api/revalidate
import "server-only"
import { API_URL } from "./config"
import type { Brand, Certificate, Faq, Post, PostSummary, Product, ProductCard, Project, Settings } from "./types"

export const DEFAULT_SETTINGS: Settings = {
  companyName: "Alux.kz",
  tagline: "Окна · Двери · Витражи · Перегородки",
  heroTitle: "Стекло и алюминий, которые создают пространство",
  heroSubtitle: "Алюминиевые окна, двери, витражи и стеклянные перегородки под ключ. Бесплатный замер и монтаж в срок.",
  phones: [],
  whatsapp: "",
  whatsappMessage: "Здравствуйте! Хочу рассчитать стоимость.",
  email: "",
  address: "г. Астана",
  workHours: "",
  instagram: "https://www.instagram.com/alux.kz/",
  mapUrl: "",
  stats: [],
}

async function getJson<T>(path: string, tag: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, { next: { revalidate: 300, tags: ["cms", tag] } })
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  }
}

const list = async <T,>(path: string, tag: string) => {
  const data = await getJson<T[]>(path, tag)
  return Array.isArray(data) ? data : []
}

export async function getSettings(): Promise<Settings> {
  const data = await getJson<Partial<Settings>>("/api/settings", "settings")
  const s = { ...DEFAULT_SETTINGS, ...(data || {}) }
  // Пустые строки из админки не должны затирать дефолтные тексты первого экрана
  return {
    ...s,
    heroTitle: s.heroTitle || DEFAULT_SETTINGS.heroTitle,
    heroSubtitle: s.heroSubtitle || DEFAULT_SETTINGS.heroSubtitle,
  }
}

export const getProducts = () => list<ProductCard>("/api/products", "products")
export const getProjects = () => list<Project>("/api/projects", "projects")
export const getBrands = () => list<Brand>("/api/brands", "brands")
export const getCertificates = () => list<Certificate>("/api/certificates", "certificates")
export const getFaq = () => list<Faq>("/api/faq", "faq")
export const getPosts = () => list<PostSummary>("/api/posts", "posts")

export async function getProduct(slug: string): Promise<Product | null> {
  const data = await getJson<Product>(`/api/products/${encodeURIComponent(slug)}`, "products")
  return data && typeof data === "object" ? { ...data, related: data.related ?? [], specs: data.specs ?? [] } : null
}

export async function getPost(slug: string): Promise<Post | null> {
  const data = await getJson<Post>(`/api/posts/${encodeURIComponent(slug)}`, "posts")
  return data && typeof data === "object" ? { ...data, keywords: data.keywords ?? [], related: data.related ?? [] } : null
}
