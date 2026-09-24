"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Award, BookOpen, Building2, ExternalLink, HelpCircle, Inbox, LayoutDashboard, LogOut, Menu, Package, Settings, Shapes, X,
} from "lucide-react"
import { LogoMark } from "@/components/logo"
import { api, getToken, logout } from "@/lib/admin-api"
import { cn } from "@/lib/format"
import { ToastProvider } from "./toast"
import { Loading } from "./ui"

const NAV = [
  { href: "/admin", label: "Сводка", icon: LayoutDashboard },
  { href: "/admin/leads", label: "Заявки", icon: Inbox },
  { href: "/admin/products", label: "Каталог", icon: Package },
  { href: "/admin/projects", label: "Объекты", icon: Building2 },
  { href: "/admin/posts", label: "Блог", icon: BookOpen },
  { href: "/admin/faq", label: "Вопросы", icon: HelpCircle },
  { href: "/admin/brands", label: "Профильные системы", icon: Shapes },
  { href: "/admin/certificates", label: "Сертификаты", icon: Award },
  { href: "/admin/settings", label: "Настройки", icon: Settings },
]

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const isLogin = pathname === "/admin/login"
  const [user, setUser] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (isLogin) return
    if (!getToken()) {
      router.replace("/admin/login")
      return
    }
    api.me().then((me) => setUser(me.login), () => {})
  }, [isLogin, router])

  useEffect(() => setMenuOpen(false), [pathname])

  if (isLogin) return <ToastProvider>{children}</ToastProvider>
  if (!user) return <Loading />

  return (
    <ToastProvider>
      <div className="min-h-dvh bg-paper lg:grid lg:grid-cols-[260px_1fr]">
        <aside
          className={cn(
            "dark fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col bg-ink-950 text-white transition-transform lg:sticky lg:top-0 lg:h-dvh lg:translate-x-0",
            menuOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center gap-3 px-6 py-6">
            <LogoMark className="h-8" />
            <div>
              <p className="font-display font-semibold">Alux CMS</p>
              <p className="text-xs text-white/40">{user}</p>
            </div>
          </div>
          <nav className="flex-1 space-y-0.5 overflow-y-auto px-3">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = href === "/admin" ? pathname === href : pathname.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                    active ? "bg-gold-500 text-ink-950" : "text-white/65 hover:bg-white/6 hover:text-white"
                  )}
                >
                  <Icon className="size-4.5" /> {label}
                </Link>
              )
            })}
          </nav>
          <div className="space-y-0.5 border-t border-white/8 p-3">
            <a href="/" target="_blank" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/65 hover:bg-white/6 hover:text-white">
              <ExternalLink className="size-4.5" /> Открыть сайт
            </a>
            <button type="button" onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/65 hover:bg-white/6 hover:text-white">
              <LogOut className="size-4.5" /> Выйти
            </button>
          </div>
        </aside>

        {menuOpen && <div className="fixed inset-0 z-30 bg-ink-950/50 lg:hidden" onClick={() => setMenuOpen(false)} />}

        <div className="min-w-0">
          <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-ink-900/8 bg-paper/90 px-4 py-3 backdrop-blur lg:hidden">
            <button type="button" onClick={() => setMenuOpen((v) => !v)} aria-label="Меню" className="grid size-10 place-items-center rounded-xl border border-ink-900/12 bg-white">
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
            <span className="font-display font-semibold">Alux CMS</span>
          </div>
          <main className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-10">{children}</main>
        </div>
      </div>
    </ToastProvider>
  )
}
