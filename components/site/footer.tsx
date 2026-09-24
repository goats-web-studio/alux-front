import Link from "next/link"
import { Mail, MapPin, Phone } from "lucide-react"
import { Logo } from "@/components/logo"
import { CATEGORIES } from "@/lib/config"
import { whatsappLink } from "@/lib/format"
import { InstagramIcon, WhatsAppIcon } from "./icons"
import type { Settings } from "@/lib/types"

export function Footer({ settings }: { settings: Settings }) {
  const wa = whatsappLink(settings.whatsapp, settings.whatsappMessage)
  return (
    <footer className="dark mullions bg-ink-950 text-white">
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Logo name={settings.companyName} />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/55">{settings.tagline}. Бесплатный замер, производство и монтаж под ключ.</p>
          <div className="mt-6 flex gap-2">
            {settings.instagram && (
              <a href={settings.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="grid size-11 place-items-center rounded-full border border-white/15 transition hover:border-gold-400 hover:text-gold-400">
                <InstagramIcon className="size-5" />
              </a>
            )}
            {wa && (
              <a href={wa} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="grid size-11 place-items-center rounded-full border border-white/15 transition hover:border-[#25d366] hover:text-[#25d366]">
                <WhatsAppIcon className="size-5" />
              </a>
            )}
          </div>
        </div>

        <nav aria-label="Каталог">
          <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-white/40 uppercase">Каталог</p>
          <ul className="space-y-2.5 text-sm">
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <Link href={`/catalog?category=${c.id}`} className="text-white/70 transition hover:text-gold-400">
                  {c.plural}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Компания">
          <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-white/40 uppercase">Компания</p>
          <ul className="space-y-2.5 text-sm">
            {[
              ["/#projects", "Объекты"],
              ["/#process", "Как мы работаем"],
              ["/#faq", "Вопросы и ответы"],
              ["/blog", "Блог"],
              ["/privacy", "Политика конфиденциальности"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="text-white/70 transition hover:text-gold-400">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-white/40 uppercase">Контакты</p>
          <ul className="space-y-3 text-sm">
            {settings.phones.map((p) => (
              <li key={p.href}>
                <a href={p.href} className="flex items-center gap-3 font-semibold transition hover:text-gold-400">
                  <Phone className="size-4 text-gold-400" /> {p.display}
                </a>
              </li>
            ))}
            {settings.email && (
              <li>
                <a href={`mailto:${settings.email}`} className="flex items-center gap-3 text-white/70 transition hover:text-gold-400">
                  <Mail className="size-4 text-gold-400" /> {settings.email}
                </a>
              </li>
            )}
            {settings.address && (
              <li className="flex items-start gap-3 text-white/70">
                <MapPin className="mt-0.5 size-4 shrink-0 text-gold-400" />
                <span>
                  {settings.address}
                  {settings.workHours && <span className="block text-white/45">{settings.workHours}</span>}
                </span>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/8">
        <div className="container-x flex flex-col gap-2 py-6 text-xs text-white/40 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {settings.companyName}. Все права защищены.</p>
          <p>Цены на сайте не являются публичной офертой</p>
        </div>
      </div>
    </footer>
  )
}
