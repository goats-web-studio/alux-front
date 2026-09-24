"use client"

import { useEffect, useRef } from "react"
import { LoaderCircle, X } from "lucide-react"
import { cn } from "@/lib/format"

export function PageHeader({ title, text, actions }: { title: string; text?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">{title}</h1>
        {text && <p className="mt-1 text-ink-500">{text}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}

export function Spinner({ className }: { className?: string }) {
  return <LoaderCircle className={cn("size-5 animate-spin text-ink-400", className)} />
}

export function Loading() {
  return (
    <div className="grid place-items-center py-24">
      <Spinner className="size-7" />
    </div>
  )
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-dashed border-ink-900/15 bg-white p-12 text-center text-ink-500">{children}</div>
}

export function Badge({ children, tone = "gray" }: { children: React.ReactNode; tone?: "gray" | "gold" | "green" | "red" | "blue" }) {
  const tones = {
    gray: "bg-ink-900/6 text-ink-700",
    gold: "bg-gold-500/15 text-gold-700",
    green: "bg-success/12 text-success",
    red: "bg-danger/12 text-danger",
    blue: "bg-sky-500/12 text-sky-700",
  }
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap", tones[tone])}>{children}</span>
}

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  wide,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
  wide?: boolean
}) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (open && !el.open) el.showModal()
    if (!open && el.open) el.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      className={cn(
        "m-0 ml-auto h-dvh max-h-dvh w-full bg-transparent p-0 backdrop:bg-ink-950/50 backdrop:backdrop-blur-[2px]",
        wide ? "max-w-4xl" : "max-w-xl"
      )}
    >
      {open && (
        <div className="flex h-full animate-reveal flex-col bg-paper shadow-2xl">
          <div className="flex items-center justify-between gap-4 border-b border-ink-900/8 bg-white px-6 py-4">
            <h2 className="text-lg font-bold">{title}</h2>
            <button type="button" onClick={onClose} aria-label="Закрыть" className="grid size-9 place-items-center rounded-full hover:bg-ink-900/6">
              <X className="size-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">{children}</div>
          {footer && <div className="flex justify-end gap-2 border-t border-ink-900/8 bg-white px-6 py-4">{footer}</div>}
        </div>
      )}
    </dialog>
  )
}

export const adminBtn = {
  primary: "btn-dark px-5 py-2.5",
  gold: "btn-gold px-5 py-2.5",
  ghost: "btn px-4 py-2.5 border border-ink-900/12 bg-white hover:bg-paper",
  icon: "grid size-9 place-items-center rounded-lg text-ink-500 transition hover:bg-ink-900/6 hover:text-ink-900 disabled:opacity-30",
  danger: "grid size-9 place-items-center rounded-lg text-ink-500 transition hover:bg-danger/10 hover:text-danger",
}
