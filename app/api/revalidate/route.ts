import { revalidateTag } from "next/cache"
import type { NextRequest } from "next/server"

// Бэкенд вызывает этот маршрут после изменений в админке, чтобы сайт сразу показал новый контент
export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET
  if (!secret || request.headers.get("x-revalidate-secret") !== secret) {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }
  let tag = "cms"
  try {
    const body = await request.json()
    if (typeof body?.tag === "string" && /^[a-z]{2,30}$/.test(body.tag)) tag = body.tag
  } catch {}
  // Настройки влияют на все страницы (шапка, подвал) — сбрасываем весь CMS-кэш
  revalidateTag(tag === "settings" ? "cms" : tag, { expire: 0 })
  return Response.json({ ok: true, tag })
}
