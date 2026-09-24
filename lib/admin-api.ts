"use client"

import { API_URL } from "./config"

const TOKEN_KEY = "alux_admin_token"

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export function getToken(): string | null {
  try {
    return window.localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token)
}

export function logout() {
  try {
    window.localStorage.removeItem(TOKEN_KEY)
  } catch {}
  if (window.location.pathname !== "/admin/login") window.location.href = "/admin/login"
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers = new Headers(init.headers)
  if (token) headers.set("Authorization", `Bearer ${token}`)
  if (init.body && !(init.body instanceof FormData)) headers.set("Content-Type", "application/json")

  let res: Response
  try {
    res = await fetch(`${API_URL}${path}`, { ...init, headers })
  } catch {
    throw new ApiError("Сервер недоступен. Проверьте, что бэкенд запущен.", 0)
  }

  if (res.status === 401 && !path.startsWith("/api/auth/login")) {
    logout()
    throw new ApiError("Сессия истекла, войдите снова", 401)
  }
  const data = res.headers.get("content-type")?.includes("application/json") ? await res.json() : null
  if (!res.ok) throw new ApiError(data?.error || `Ошибка ${res.status}`, res.status)
  return data as T
}

export const api = {
  get: <T,>(path: string) => request<T>(`/api/admin${path}`),
  post: <T,>(path: string, body?: unknown) => request<T>(`/api/admin${path}`, { method: "POST", body: body === undefined ? undefined : JSON.stringify(body) }),
  put: <T,>(path: string, body: unknown) => request<T>(`/api/admin${path}`, { method: "PUT", body: JSON.stringify(body) }),
  patch: <T,>(path: string, body: unknown) => request<T>(`/api/admin${path}`, { method: "PATCH", body: JSON.stringify(body) }),
  del: (path: string) => request<{ ok: true }>(`/api/admin${path}`, { method: "DELETE" }),

  login: (login: string, password: string) =>
    request<{ token: string }>("/api/auth/login", { method: "POST", body: JSON.stringify({ login, password }) }),
  me: () => request<{ login: string }>("/api/auth/me"),

  upload: async (file: File) => {
    const form = new FormData()
    form.append("file", file)
    return request<{ url: string }>("/api/admin/upload", { method: "POST", body: form })
  },

  // CSV качаем через fetch, чтобы передать токен
  downloadCsv: async () => {
    const res = await fetch(`${API_URL}/api/admin/leads/export.csv`, { headers: { Authorization: `Bearer ${getToken()}` } })
    if (!res.ok) throw new ApiError("Не удалось выгрузить заявки", res.status)
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = Object.assign(document.createElement("a"), { href: url, download: `leads-${new Date().toISOString().slice(0, 10)}.csv` })
    a.click()
    URL.revokeObjectURL(url)
  },
}

export const errorMessage = (err: unknown) => (err instanceof Error ? err.message : "Что-то пошло не так")

export type LeadStatus = "new" | "in_progress" | "done" | "spam"

export type Lead = {
  id: number
  name: string
  phone: string
  email: string | null
  comment: string | null
  source: string | null
  product: string | null
  status: LeadStatus
  note: string
  whatsappSent: boolean
  whatsappError: string | null
  createdAt: string
  updatedAt: string
}

export type Stats = {
  leads: { total: number; new: number; inProgress: number; done: number; today: number; week: number }
  products: number
  projects: number
  posts: number
  whatsapp: { provider: string; configured: boolean; recipients: number }
}

export type WhatsappStatus = { provider: string; configured: boolean; recipients: string[]; clientReply: boolean }
