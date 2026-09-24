"use client"

import { useId, useState } from "react"
import Link from "next/link"
import { ArrowRight, CheckCircle2, LoaderCircle } from "lucide-react"
import { submitLead } from "./submit"
import { formatPhone, isValidPhone, cn } from "@/lib/format"
import type { LeadSource } from "@/lib/types"

type Props = {
  source: LeadSource
  product?: string
  /** Дополнительный текст, который уйдёт в комментарий (например, ответы калькулятора) */
  extraComment?: string
  withComment?: boolean
  submitLabel?: string
  onSuccess?: () => void
  className?: string
}

const initial = { name: "", phone: "", comment: "", consent: true, website: "" }

export function LeadForm({ source, product, extraComment, withComment = true, submitLabel = "Отправить заявку", onSuccess, className }: Props) {
  const id = useId()
  const [form, setForm] = useState(initial)
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const update = (patch: Partial<typeof initial>) => {
    setForm((prev) => ({ ...prev, ...patch }))
    if (status === "error") {
      setStatus("idle")
      setMessage("")
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (status === "loading") return
    const error = !form.name.trim()
      ? "Как к вам обращаться?"
      : !isValidPhone(form.phone)
        ? "Введите номер телефона полностью"
        : !form.consent
          ? "Нужно согласие на обработку персональных данных"
          : ""
    if (error) {
      setStatus("error")
      setMessage(error)
      return
    }

    setStatus("loading")
    const comment = [extraComment, form.comment.trim()].filter(Boolean).join("\n")
    const result = await submitLead({
      name: form.name.trim(),
      phone: form.phone,
      comment: comment || undefined,
      source,
      product,
      website: form.website,
    })
    if (result.ok) {
      setStatus("success")
      setForm(initial)
      onSuccess?.()
    } else {
      setStatus("error")
      setMessage(result.error)
    }
  }

  if (status === "success") {
    return (
      <div role="status" className={cn("flex flex-col items-center py-8 text-center", className)}>
        <span className="mb-5 grid size-16 place-items-center rounded-full bg-gold-500/15 text-gold-500">
          <CheckCircle2 className="size-8" />
        </span>
        <p className="font-display text-xl font-semibold">Заявка отправлена</p>
        <p className="mt-2 max-w-xs text-sm opacity-70">Менеджер свяжется с вами в течение 15 минут в рабочее время.</p>
        <button type="button" onClick={() => setStatus("idle")} className="mt-6 text-sm font-semibold text-gold-600 hover:underline">
          Отправить ещё одну
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={cn("relative space-y-3", className)}>
      {/* Honeypot: должно остаться пустым */}
      <div className="pointer-events-none absolute -left-[9999px] h-px w-px overflow-hidden opacity-0" aria-hidden="true">
        <label htmlFor={`${id}-website`}>Website</label>
        <input id={`${id}-website`} tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => update({ website: e.target.value })} />
      </div>

      <label className="sr-only" htmlFor={`${id}-name`}>Имя</label>
      <input
        id={`${id}-name`}
        className="field"
        placeholder="Ваше имя"
        autoComplete="name"
        value={form.name}
        onChange={(e) => update({ name: e.target.value })}
      />
      <label className="sr-only" htmlFor={`${id}-phone`}>Телефон</label>
      <input
        id={`${id}-phone`}
        className="field"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="+7 (___) ___-__-__"
        value={form.phone}
        onChange={(e) => update({ phone: formatPhone(e.target.value) })}
      />
      {withComment && (
        <>
          <label className="sr-only" htmlFor={`${id}-comment`}>Комментарий</label>
          <textarea
            id={`${id}-comment`}
            className="field min-h-24 resize-none"
            placeholder="Что нужно сделать? (необязательно)"
            value={form.comment}
            onChange={(e) => update({ comment: e.target.value })}
          />
        </>
      )}

      {status === "error" && message && (
        <p role="alert" className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
          {message}
        </p>
      )}

      <button type="submit" className="btn-gold w-full py-4" disabled={status === "loading"} aria-busy={status === "loading"}>
        {status === "loading" ? <LoaderCircle className="size-5 animate-spin" /> : null}
        {status === "loading" ? "Отправляем…" : submitLabel}
        {status !== "loading" && <ArrowRight className="size-4" />}
      </button>

      <label className="flex items-start gap-2.5 pt-1 text-xs leading-relaxed opacity-60">
        <input
          type="checkbox"
          checked={form.consent}
          onChange={(e) => update({ consent: e.target.checked })}
          className="mt-0.5 size-4 shrink-0 accent-gold-500"
        />
        <span>
          Соглашаюсь с{" "}
          <Link href="/privacy" className="underline underline-offset-2 hover:opacity-100" target="_blank">
            политикой обработки персональных данных
          </Link>
        </span>
      </label>
    </form>
  )
}
