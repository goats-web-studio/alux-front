"use client"

import { createContext, useCallback, useContext, useState } from "react"
import { CheckCircle2, XCircle } from "lucide-react"

type Toast = { id: number; text: string; kind: "ok" | "error" }
const ToastContext = createContext<(text: string, kind?: Toast["kind"]) => void>(() => {})

export const useToast = () => useContext(ToastContext)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const push = useCallback((text: string, kind: Toast["kind"] = "ok") => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, text, kind }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000)
  }, [])

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="fixed right-4 bottom-4 z-[100] flex w-80 flex-col gap-2" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className="flex animate-reveal items-start gap-3 rounded-xl bg-ink-900 px-4 py-3 text-sm text-white shadow-xl">
            {t.kind === "ok" ? <CheckCircle2 className="size-5 shrink-0 text-success" /> : <XCircle className="size-5 shrink-0 text-danger" />}
            <span>{t.text}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
