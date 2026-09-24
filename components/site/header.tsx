"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Phone, X } from "lucide-react"
import { Logo } from "@/components/logo"
import { openLead } from "@/components/lead/lead-dialog"
import { cn } from "@/lib/format"
import type { Phone as PhoneT } from "@/lib/types"

const NAV = [
  { href: "/catalog", label: "Каталог" },
  { href: "/#projects", label: "Объекты" },
  { href: "/#process", label: "Как работаем" },
  { href: "/#calc", label: "Расчёт" },
  { href: "/blog", label: "Блог" },
  { href: "/#contacts", label: "Контакты" },
]

export function Header({ companyName, phone }: { companyName: string; phone?: PhoneT }) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  // На главной шапка прозрачная поверх тёмного первого экрана
  const overHero = pathname === "/" && !scrolled && !open

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : ""
    return () => {
      document.documentElement.style.overflow = ""
    }
  }, [open])

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-[background,box-shadow,color] duration-300",
        overHero ? "text-white" : "bg-paper/85 text-ink-900 shadow-[0_1px_0_rgb(22_24_27/0.08)] backdrop-blur-xl"
      )}
    >
      <div className="container-x flex h-18 items-center gap-6">
        <Link href="/" aria-label={`${companyName} — на главную`} className="shrink-0">
          <Logo name={companyName} />
        </Link>

        <nav aria-label="Основное меню" className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                    overHero ? "text-white/75 hover:text-white" : "text-ink-500 hover:text-ink-900",
                    pathname.startsWith(item.href) && item.href !== "/" && "text-gold-600"
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-3 lg:ml-4">
          {phone && (
            <a href={phone.href} className="hidden items-center gap-2 text-sm font-semibold xl:flex">
              <Phone className="size-4 text-gold-500" />
              {phone.display}
            </a>
          )}
          <button
            type="button"
            className="btn-gold hidden px-5 py-2.5 sm:inline-flex"
            onClick={() => openLead({ source: "callback", title: "Бесплатный замер" })}
          >
            Вызвать замерщика
          </button>
          <button
            type="button"
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid size-11 place-items-center rounded-full border border-current/15 lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-ink-900/8 bg-paper lg:hidden">
          <nav aria-label="Мобильное меню" className="container-x flex flex-col py-6">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-ink-900/8 py-4 font-display text-2xl font-semibold"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-8 flex flex-col gap-3">
              <button
                type="button"
                className="btn-gold py-4"
                onClick={() => {
                  setOpen(false)
                  openLead({ source: "callback", title: "Бесплатный замер" })
                }}
              >
                Вызвать замерщика
              </button>
              {phone && (
                <a href={phone.href} className="btn-ghost py-4">
                  <Phone className="size-4" /> {phone.display}
                </a>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
