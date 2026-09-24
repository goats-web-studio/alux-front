"use client"

import { useCallback, useEffect, useState } from "react"
import { Download, RefreshCw, Search, Send, Trash2 } from "lucide-react"
import { api, errorMessage, type Lead, type LeadStatus } from "@/lib/admin-api"
import { useToast } from "@/components/admin/toast"
import { adminBtn, Badge, Empty, Loading, Modal, PageHeader, Spinner } from "@/components/admin/ui"
import { SOURCE, STATUS, formatDateTime } from "@/components/admin/lead-meta"
import { WhatsAppIcon } from "@/components/site/icons"
import { whatsappLink, cn } from "@/lib/format"

const FILTERS: { value: LeadStatus | ""; label: string }[] = [
  { value: "", label: "Все" },
  { value: "new", label: "Новые" },
  { value: "in_progress", label: "В работе" },
  { value: "done", label: "Завершённые" },
  { value: "spam", label: "Спам" },
]

export default function LeadsPage() {
  const toast = useToast()
  const [leads, setLeads] = useState<Lead[] | null>(null)
  const [status, setStatus] = useState<LeadStatus | "">("")
  const [q, setQ] = useState("")
  const [open, setOpen] = useState<Lead | null>(null)
  const [note, setNote] = useState("")
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    const params = new URLSearchParams()
    if (status) params.set("status", status)
    if (q.trim()) params.set("q", q.trim())
    try {
      setLeads(await api.get<Lead[]>(`/leads?${params}`))
    } catch (err) {
      toast(errorMessage(err), "error")
      setLeads([])
    }
  }, [status, q, toast])

  useEffect(() => {
    const t = setTimeout(load, q ? 300 : 0)
    return () => clearTimeout(t)
  }, [load, q])

  const replace = (lead: Lead) => {
    setLeads((list) => list?.map((l) => (l.id === lead.id ? lead : l)) ?? null)
    setOpen((o) => (o?.id === lead.id ? lead : o))
  }

  async function patch(lead: Lead, body: Partial<Pick<Lead, "status" | "note">>) {
    try {
      replace(await api.patch<Lead>(`/leads/${lead.id}`, body))
      toast("Сохранено")
    } catch (err) {
      toast(errorMessage(err), "error")
    }
  }

  async function resend(lead: Lead) {
    setBusy(true)
    try {
      replace(await api.post<Lead>(`/leads/${lead.id}/notify`))
      toast("Отправлено в WhatsApp")
    } catch (err) {
      toast(errorMessage(err), "error")
      load()
    } finally {
      setBusy(false)
    }
  }

  async function remove(lead: Lead) {
    if (!confirm(`Удалить заявку от «${lead.name}»?`)) return
    try {
      await api.del(`/leads/${lead.id}`)
      setOpen(null)
      load()
    } catch (err) {
      toast(errorMessage(err), "error")
    }
  }

  return (
    <>
      <PageHeader
        title="Заявки"
        text="Все обращения с сайта. Новые заявки дублируются в WhatsApp"
        actions={
          <>
            <button type="button" className={adminBtn.ghost} onClick={load}>
              <RefreshCw className="size-4" /> Обновить
            </button>
            <button type="button" className={adminBtn.ghost} onClick={() => api.downloadCsv().catch((err) => toast(errorMessage(err), "error"))}>
              <Download className="size-4" /> Excel (CSV)
            </button>
          </>
        }
      />

      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="scrollbar-none flex gap-1 overflow-x-auto rounded-xl bg-white p-1 ring-1 ring-ink-900/8">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setStatus(f.value)}
              className={cn("rounded-lg px-3.5 py-2 text-sm font-semibold whitespace-nowrap transition", status === f.value ? "bg-ink-900 text-white" : "text-ink-500 hover:text-ink-900")}
            >
              {f.label}
            </button>
          ))}
        </div>
        <label className="relative md:ml-auto md:w-72">
          <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink-400" />
          <input className="field py-2.5 pl-10 text-sm" placeholder="Имя, телефон, комментарий" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
      </div>

      {!leads ? (
        <Loading />
      ) : !leads.length ? (
        <Empty>Заявок не найдено</Empty>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-white ring-1 ring-ink-900/8">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-ink-900/8 text-xs text-ink-400 uppercase">
              <tr>
                <th className="px-5 py-3 font-semibold">Дата</th>
                <th className="px-5 py-3 font-semibold">Клиент</th>
                <th className="px-5 py-3 font-semibold">Запрос</th>
                <th className="px-5 py-3 font-semibold">Статус</th>
                <th className="px-5 py-3 font-semibold">WA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-900/6">
              {leads.map((l) => (
                <tr
                  key={l.id}
                  onClick={() => {
                    setOpen(l)
                    setNote(l.note)
                  }}
                  className={cn("cursor-pointer align-top transition hover:bg-paper/60", l.status === "new" && "bg-gold-500/5")}
                >
                  <td className="px-5 py-4 whitespace-nowrap text-ink-500">{formatDateTime(l.createdAt)}</td>
                  <td className="px-5 py-4">
                    <p className="font-semibold">{l.name}</p>
                    <p className="text-ink-500">{l.phone}</p>
                  </td>
                  <td className="max-w-xs px-5 py-4">
                    {l.product && <p className="font-medium">{l.product}</p>}
                    <p className="line-clamp-2 whitespace-pre-line text-ink-500">{l.comment || "—"}</p>
                    <p className="mt-1 text-xs text-ink-400">{SOURCE[l.source ?? ""] ?? l.source}</p>
                  </td>
                  <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={l.status}
                      onChange={(e) => patch(l, { status: e.target.value as LeadStatus })}
                      className="rounded-lg border border-ink-900/10 bg-white px-2 py-1.5 text-sm font-medium"
                      aria-label="Статус заявки"
                    >
                      {Object.entries(STATUS).map(([value, s]) => (
                        <option key={value} value={value}>{s.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-4">
                    {l.whatsappSent ? <Badge tone="green">✓</Badge> : <Badge tone="red">нет</Badge>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={Boolean(open)} onClose={() => setOpen(null)} title={open ? `Заявка №${open.id}` : ""}>
        {open && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-white p-5 ring-1 ring-ink-900/8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xl font-bold">{open.name}</p>
                  <a href={`tel:${open.phone}`} className="mt-1 block text-lg text-ink-700 hover:underline">{open.phone}</a>
                  {open.email && <a href={`mailto:${open.email}`} className="block text-sm text-ink-500">{open.email}</a>}
                </div>
                <Badge tone={STATUS[open.status].tone}>{STATUS[open.status].label}</Badge>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <a href={whatsappLink(open.phone, `Здравствуйте, ${open.name}! Это Alux.kz по вашей заявке.`)} target="_blank" rel="noopener noreferrer" className="btn-wa px-4 py-2.5">
                  <WhatsAppIcon className="size-4" /> Написать клиенту
                </a>
                <a href={`tel:${open.phone}`} className={adminBtn.ghost}>Позвонить</a>
              </div>
            </div>

            <dl className="grid grid-cols-[120px_1fr] gap-x-4 gap-y-3 text-sm">
              <dt className="text-ink-400">Создана</dt>
              <dd>{formatDateTime(open.createdAt)}</dd>
              <dt className="text-ink-400">Источник</dt>
              <dd>{SOURCE[open.source ?? ""] ?? open.source ?? "—"}</dd>
              {open.product && (
                <>
                  <dt className="text-ink-400">Интересует</dt>
                  <dd className="font-medium">{open.product}</dd>
                </>
              )}
              <dt className="text-ink-400">Комментарий</dt>
              <dd className="whitespace-pre-line">{open.comment || "—"}</dd>
              <dt className="text-ink-400">WhatsApp</dt>
              <dd>
                {open.whatsappSent ? (
                  <span className="text-success">Уведомление доставлено менеджерам</span>
                ) : (
                  <span className="text-danger">Не отправлено{open.whatsappError ? `: ${open.whatsappError}` : ""}</span>
                )}
                <button type="button" onClick={() => resend(open)} disabled={busy} className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-gold-700 hover:underline disabled:opacity-50">
                  {busy ? <Spinner className="size-4" /> : <Send className="size-4" />} Отправить повторно
                </button>
              </dd>
            </dl>

            <div>
              <p className="mb-2 text-sm font-semibold">Статус</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(STATUS).map(([value, s]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => patch(open, { status: value as LeadStatus })}
                    className={cn("rounded-lg px-3.5 py-2 text-sm font-semibold ring-1 transition", open.status === value ? "bg-ink-900 text-white ring-ink-900" : "bg-white ring-ink-900/10 hover:ring-ink-900/30")}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="lead-note" className="mb-2 block text-sm font-semibold">Заметка менеджера</label>
              <textarea id="lead-note" rows={4} className="field" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Например: замер в четверг в 15:00" />
              <div className="mt-3 flex justify-between">
                <button type="button" onClick={() => remove(open)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-danger hover:underline">
                  <Trash2 className="size-4" /> Удалить заявку
                </button>
                <button type="button" className={adminBtn.primary} disabled={note === open.note} onClick={() => patch(open, { note })}>
                  Сохранить заметку
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
