import type { LeadStatus } from "@/lib/admin-api"

export const STATUS: Record<LeadStatus, { label: string; tone: "gold" | "blue" | "green" | "gray" }> = {
  new: { label: "Новая", tone: "gold" },
  in_progress: { label: "В работе", tone: "blue" },
  done: { label: "Завершена", tone: "green" },
  spam: { label: "Спам", tone: "gray" },
}

export const SOURCE: Record<string, string> = {
  hero: "Первый экран",
  contacts: "Форма контактов",
  product: "Страница товара",
  quiz: "Расчёт стоимости",
  blog: "Блог",
  callback: "Обратный звонок",
  project: "Портфолио",
}

export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" })
