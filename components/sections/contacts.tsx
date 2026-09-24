import { Clock, Mail, MapPin, Phone } from "lucide-react"
import { LeadForm } from "@/components/lead/lead-form"
import { WhatsAppIcon, InstagramIcon } from "@/components/site/icons"
import { whatsappLink } from "@/lib/format"
import type { Settings } from "@/lib/types"

export function Contacts({ settings }: { settings: Settings }) {
  const wa = whatsappLink(settings.whatsapp, settings.whatsappMessage)
  return (
    <section id="contacts" className="dark relative overflow-hidden bg-ink-950 py-20 text-white md:py-28">
      <div className="absolute -bottom-40 -left-40 size-[36rem] rounded-full bg-gold-500/10 blur-3xl" />
      <div className="container-x relative grid gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <p className="eyebrow reveal">Контакты</p>
          <h2 className="h-section reveal mt-4">Ваша заявка — мы начинаем работу</h2>
          <p className="reveal mt-5 max-w-lg text-lg leading-relaxed text-white/60">
            Оставьте номер — перезвоним, ответим на вопросы и запишем на бесплатный замер в удобное время.
          </p>

          <ul className="reveal mt-10 space-y-5">
            {settings.phones.map((p) => (
              <li key={p.href}>
                <a href={p.href} className="group flex items-center gap-4">
                  <span className="grid size-12 place-items-center rounded-2xl border border-white/10 text-gold-400 transition group-hover:bg-gold-500 group-hover:text-ink-950">
                    <Phone className="size-5" />
                  </span>
                  <span className="font-display text-2xl font-semibold">{p.display}</span>
                </a>
              </li>
            ))}
            {settings.email && (
              <li className="flex items-center gap-4 text-white/75">
                <span className="grid size-12 place-items-center rounded-2xl border border-white/10 text-gold-400">
                  <Mail className="size-5" />
                </span>
                <a href={`mailto:${settings.email}`} className="hover:text-white">{settings.email}</a>
              </li>
            )}
            {settings.address && (
              <li className="flex items-center gap-4 text-white/75">
                <span className="grid size-12 place-items-center rounded-2xl border border-white/10 text-gold-400">
                  <MapPin className="size-5" />
                </span>
                {settings.mapUrl ? (
                  <a href={settings.mapUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-white/20 underline-offset-4 hover:text-white">
                    {settings.address}
                  </a>
                ) : (
                  settings.address
                )}
              </li>
            )}
            {settings.workHours && (
              <li className="flex items-center gap-4 text-white/75">
                <span className="grid size-12 place-items-center rounded-2xl border border-white/10 text-gold-400">
                  <Clock className="size-5" />
                </span>
                {settings.workHours}
              </li>
            )}
          </ul>

          <div className="reveal mt-10 flex flex-wrap gap-3">
            {wa && (
              <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-wa">
                <WhatsAppIcon className="size-5" /> Написать в WhatsApp
              </a>
            )}
            {settings.instagram && (
              <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                <InstagramIcon className="size-5" /> Instagram
              </a>
            )}
          </div>
        </div>

        <div className="reveal rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 backdrop-blur md:p-10">
          <p className="text-2xl font-bold">Бесплатный замер</p>
          <p className="mt-2 mb-7 text-white/55">Перезвоним в течение 15 минут в рабочее время</p>
          <LeadForm source="contacts" />
        </div>
      </div>
    </section>
  )
}
