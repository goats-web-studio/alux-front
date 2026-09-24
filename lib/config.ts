import type { Category } from "./types"

export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000").replace(/\/+$/, "")
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "")

export const CATEGORIES: { id: Category; label: string; plural: string }[] = [
  { id: "partitions", label: "Перегородки", plural: "Стеклянные перегородки" },
  { id: "facades", label: "Витражи", plural: "Витражи и фасады" },
  { id: "doors", label: "Двери", plural: "Алюминиевые двери" },
  { id: "windows", label: "Окна", plural: "Алюминиевые окна" },
  { id: "other", label: "Другое", plural: "Раздвижные системы и другое" },
]

export const categoryLabel = (id: string) => CATEGORIES.find((c) => c.id === id)?.label ?? "Другое"

export function mediaUrl(path: string | null | undefined): string {
  if (!path) return ""
  if (/^(https?:)?\/\//i.test(path) || path.startsWith("data:") || path.startsWith("blob:")) return path
  return `${API_URL}${path.startsWith("/") ? "" : "/"}${path}`
}
