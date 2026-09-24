"use client"

import { useEffect, useRef, useState } from "react"
import { X } from "lucide-react"
import { LeadForm } from "./lead-form"
import type { LeadSource } from "@/lib/types"

export type LeadRequest = {
  source: LeadSource
  product?: string
  title?: string
  subtitle?: string
}

const EVENT = "alux:lead"

/** Открыть форму заявки из любого места (кнопки, карточки товаров и т.п.) */
export function openLead(detail: LeadRequest) {
  window.dispatchEvent(new CustomEvent<LeadRequest>(EVENT, { detail }))
}

// Одна модалка на весь сайт, монтируется в layout
export function LeadDialog() {
  const ref = useRef<HTMLDialogElement>(null)
  const [request, setRequest] = useState<LeadRequest | null>(null)
  const [key, setKey] = useState(0)

  useEffect(() => {
    const onOpen = (e: Event) => {
      setRequest((e as CustomEvent<LeadRequest>).detail)
      setKey((k) => k + 1)
      ref.current?.showModal()
    }
    window.addEventListener(EVENT, onOpen)
    return () => window.removeEventListener(EVENT, onOpen)
  }, [])

  const close = () => ref.current?.close()

  return (
    <dialog
      ref={ref}
      aria-labelledby="lead-dialog-title"
      onClick={(e) => e.target === e.currentTarget && close()}
      className="dark m-auto w-[calc(100%-2rem)] max-w-md overflow-visible rounded-3xl bg-transparent p-0 text-white backdrop:bg-ink-950/70 backdrop:backdrop-blur-sm open:animate-reveal"
    >
      <div className="relative rounded-3xl border border-white/10 bg-ink-900 p-6 shadow-2xl sm:p-8">
        <button
          type="button"
          onClick={close}
          aria-label="Закрыть"
          className="absolute top-4 right-4 grid size-10 place-items-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
        >
          <X className="size-5" />
        </button>
        <p className="eyebrow mb-3">Бесплатный замер</p>
        <h2 id="lead-dialog-title" className="pr-8 font-display text-2xl font-semibold">
          {request?.title || "Оставьте заявку"}
        </h2>
        <p className="mt-2 mb-6 text-sm text-white/60">
          {request?.subtitle || "Перезвоним, ответим на вопросы и договоримся о времени замера."}
        </p>
        {request?.product && (
          <p className="mb-4 rounded-xl border border-gold-500/30 bg-gold-500/10 px-4 py-3 text-sm">
            <span className="text-white/60">Интересует: </span>
            <span className="font-semibold text-gold-300">{request.product}</span>
          </p>
        )}
        {request && <LeadForm key={key} source={request.source} product={request.product} />}
      </div>
    </dialog>
  )
}
