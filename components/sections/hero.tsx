import { ArrowRight, Ruler } from "lucide-react"
import { whatsappLink } from "@/lib/format"
import { WhatsAppIcon } from "@/components/site/icons"
import type { Settings } from "@/lib/types"

export function Hero({ settings }: { settings: Settings }) {
  const wa = whatsappLink(settings.whatsapp, settings.whatsappMessage)

  return (
    <section className="dark relative isolate overflow-hidden bg-ink-950 pt-28 pb-16 text-white md:pt-36 md:pb-24">
      <div className="mullions absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_70%_40%,black,transparent_75%)]" />
      <div className="absolute -top-40 right-0 -z-10 size-[42rem] rounded-full bg-gold-500/10 blur-3xl" />

      <div className="container-x grid items-center gap-14 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <p className="eyebrow animate-reveal">{settings.tagline}</p>
          <h1 className="mt-6 animate-reveal font-display text-[1.85rem] leading-[1.08] font-semibold tracking-tight text-balance [animation-delay:80ms] min-[400px]:text-[2.1rem] sm:text-6xl xl:text-[4.4rem]">
            {settings.heroTitle}
          </h1>
          <p className="mt-6 max-w-xl animate-reveal text-lg leading-relaxed text-white/65 [animation-delay:160ms]">
            {settings.heroSubtitle}
          </p>

          <div className="mt-9 flex animate-reveal flex-col gap-3 [animation-delay:240ms] sm:flex-row">
            <a href="#calc" className="btn-gold px-7 py-4 text-base">
              Рассчитать стоимость <ArrowRight className="size-4" />
            </a>
            {wa && (
              <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-ghost px-7 py-4 text-base">
                <WhatsAppIcon className="size-5 text-[#25d366]" /> Написать в WhatsApp
              </a>
            )}
          </div>

          {settings.stats.length > 0 && (
            <dl className="mt-14 grid animate-reveal grid-cols-2 gap-x-6 gap-y-8 border-t border-white/10 pt-8 [animation-delay:320ms] sm:grid-cols-4">
              {settings.stats.map((s) => (
                <div key={s.label}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="font-display text-3xl font-semibold text-gold-400">{s.value}</dd>
                  <dd className="mt-1.5 text-sm leading-snug text-white/50">{s.label}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        <HeroVisual />
      </div>
    </section>
  )
}

// Два фото объектов и золотая рама с импостами, которая «прорисовывается» при загрузке
function HeroVisual() {
  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-md lg:max-w-none">
      <div className="absolute inset-y-0 right-0 w-[72%] overflow-hidden rounded-[2rem] shadow-2xl shadow-black/50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/img/abu-dhabi-plaza.jpg"
          alt="Цельностеклянные витрины в ТЦ Abu Dhabi Plaza, Астана"
          fetchPriority="high"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent" />
        <p className="absolute right-5 bottom-5 left-5 text-sm text-white/80">
          <span className="block text-xs tracking-[0.18em] text-gold-300 uppercase">Объект</span>
          ТЦ «Abu Dhabi Plaza», Астана
        </p>
      </div>

      <div className="absolute bottom-[8%] left-0 w-[44%] overflow-hidden rounded-3xl border-4 border-ink-950 shadow-2xl shadow-black/60">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/office-partition.jpg" alt="Стеклянные перегородки в офисе" className="aspect-[3/4] w-full object-cover" />
      </div>

      <svg viewBox="0 0 100 125" className="pointer-events-none absolute inset-y-0 right-0 h-full w-[72%]" fill="none" aria-hidden="true">
        <g stroke="var(--color-gold-400)" strokeWidth="0.35" strokeDasharray={1}>
          <rect x="6" y="6" width="88" height="113" rx="4" pathLength={1} className="motion-safe:animate-draw" />
          <path d="M50 6v113" pathLength={1} className="[animation-delay:400ms] motion-safe:animate-draw" />
          <path d="M6 45h88" pathLength={1} className="[animation-delay:700ms] motion-safe:animate-draw" />
        </g>
      </svg>

      <div className="absolute top-[10%] left-[6%] flex animate-float items-center gap-3 rounded-2xl border border-white/10 bg-ink-900/85 px-4 py-3 shadow-xl backdrop-blur-md">
        <span className="grid size-10 place-items-center rounded-xl bg-gold-500 text-ink-950">
          <Ruler className="size-5" />
        </span>
        <span className="text-sm leading-tight">
          <b className="block">Замер — 0 ₸</b>
          <span className="text-white/55">Астана и регионы</span>
        </span>
      </div>
    </div>
  )
}
