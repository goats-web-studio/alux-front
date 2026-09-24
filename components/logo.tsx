import { cn } from "@/lib/format"

// Знак Alux: разомкнутый шестигранник (как в логотипе) и золотое окно в перспективе
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 56 48" fill="none" aria-hidden="true" className={cn("h-9 w-auto", className)}>
      <path d="M18 3H11L2 24l9 21h7" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <path d="M38 3h7l9 21-9 21h-7" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <path d="M16 12l20-6v36l-20-6z" stroke="var(--color-gold-500)" strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M24 9.6v28.8M16 22.4l20 -1.2" stroke="var(--color-gold-500)" strokeWidth="2.2" />
    </svg>
  )
}

export function Logo({ name = "Alux.kz", className }: { name?: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="font-display text-xl font-semibold tracking-tight">{name}</span>
    </span>
  )
}
