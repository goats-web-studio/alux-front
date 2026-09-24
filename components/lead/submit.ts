import { API_URL } from "@/lib/config"
import type { LeadPayload } from "@/lib/types"

export async function submitLead(payload: LeadPayload): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const res = await fetch(`${API_URL}/api/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    if (res.ok) return { ok: true }
    let error =
      res.status === 429 ? "Слишком много заявок. Попробуйте позже." : "Не удалось отправить заявку. Проверьте данные."
    try {
      const data = await res.json()
      if (data && typeof data.error === "string" && data.error) error = data.error
    } catch {}
    return { ok: false, error }
  } catch {
    return { ok: false, error: "Сервер недоступен. Позвоните или напишите нам в WhatsApp." }
  }
}
