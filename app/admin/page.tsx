"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, BookOpen, Building2, Inbox, Package } from "lucide-react"
import { api, errorMessage, type Lead, type Stats } from "@/lib/admin-api"
import { useToast } from "@/components/admin/toast"
import { Badge, Loading, PageHeader } from "@/components/admin/ui"
import { SOURCE, STATUS, formatDateTime } from "@/components/admin/lead-meta"
import { WhatsAppIcon } from "@/components/site/icons"

export default function DashboardPage() {
  const toast = useToast()
  const [stats, setStats] = useState<Stats | null>(null)
  const [leads, setLeads] = useState<Lead[]>([])

  useEffect(() => {
    Promise.all([api.get<Stats>("/stats"), api.get<Lead[]>("/leads")])
      .then(([s, l]) => {
        setStats(s)
        setLeads(l.slice(0, 6))
      })
      .catch((err) => toast(errorMessage(err), "error"))
  }, [toast])

  if (!stats) return <Loading />

  const cards = [
    { label: "Новые заявки", value: stats.leads.new, sub: `${stats.leads.today} за сутки · ${stats.leads.week} за неделю`, href: "/admin/leads", icon: Inbox, accent: true },
    { label: "Товаров в каталоге", value: stats.products, href: "/admin/products", icon: Package },
    { label: "Объектов", value: stats.projects, href: "/admin/projects", icon: Building2 },
    { label: "Статей", value: stats.posts, href: "/admin/posts", icon: BookOpen },
  ]

  return (
    <>
      <PageHeader title="Сводка" text="Что происходит на сайте" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, sub, href, icon: Icon, accent }) => (
          <Link key={label} href={href} className={`rounded-2xl p-5 ring-1 transition hover:-translate-y-0.5 ${accent ? "bg-ink-900 text-white ring-ink-900" : "bg-white ring-ink-900/8"}`}>
            <Icon className={`size-5 ${accent ? "text-gold-400" : "text-ink-400"}`} />
            <p className="mt-4 font-display text-3xl font-semibold">{value}</p>
            <p className={`mt-1 text-sm ${accent ? "text-white/60" : "text-ink-500"}`}>{label}</p>
            {sub && <p className="mt-2 text-xs text-white/40">{sub}</p>}
          </Link>
        ))}
      </div>

      <Link
        href="/admin/settings#whatsapp"
        className={`mt-4 flex items-center gap-4 rounded-2xl p-5 ring-1 ${stats.whatsapp.configured ? "bg-success/8 ring-success/20" : "bg-gold-500/10 ring-gold-500/30"}`}
      >
        <span className="grid size-11 place-items-center rounded-xl bg-[#25d366] text-white">
          <WhatsAppIcon className="size-6" />
        </span>
        <span className="flex-1 text-sm">
          <b className="block">{stats.whatsapp.configured ? "WhatsApp-уведомления работают" : "WhatsApp-уведомления не настроены"}</b>
          <span className="text-ink-500">
            {stats.whatsapp.configured
              ? `Провайдер: ${stats.whatsapp.provider}, получателей: ${stats.whatsapp.recipients}`
              : "Заявки сохраняются здесь, но менеджеры не получают сообщения. Настройте провайдера и номера."}
          </span>
        </span>
        <ArrowRight className="size-4 text-ink-400" />
      </Link>

      <div className="mt-10 mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">Последние заявки</h2>
        <Link href="/admin/leads" className="text-sm font-semibold text-gold-700 hover:underline">
          Все заявки →
        </Link>
      </div>
      {leads.length ? (
        <ul className="divide-y divide-ink-900/6 overflow-hidden rounded-2xl bg-white ring-1 ring-ink-900/8">
          {leads.map((l) => (
            <li key={l.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3.5 text-sm">
              <span className="w-28 text-ink-400">{formatDateTime(l.createdAt)}</span>
              <span className="font-semibold">{l.name}</span>
              <a href={`tel:${l.phone}`} className="text-ink-700 hover:underline">{l.phone}</a>
              <span className="text-ink-400">{SOURCE[l.source ?? ""] ?? l.source}</span>
              <span className="ml-auto">
                <Badge tone={STATUS[l.status].tone}>{STATUS[l.status].label}</Badge>
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-2xl bg-white p-8 text-center text-sm text-ink-500 ring-1 ring-ink-900/8">Заявок пока нет</p>
      )}
    </>
  )
}
