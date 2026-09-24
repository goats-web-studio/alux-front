import { FileText } from "lucide-react"
import { mediaUrl } from "@/lib/config"
import { SectionHeading } from "./section-heading"
import type { Brand, Certificate } from "@/lib/types"

const isImage = (path: string | null) => Boolean(path && /\.(png|jpe?g|webp|avif|svg)(\?.*)?$/i.test(path))

// Профильные системы, с которыми работаем, и документы
export function Partners({ brands, certificates }: { brands: Brand[]; certificates: Certificate[] }) {
  if (!brands.length && !certificates.length) return null
  return (
    <section className="py-20 md:py-28">
      <div className="container-x">
        {brands.length > 0 && (
          <>
            <SectionHeading
              eyebrow="Профильные системы"
              title="Работаем с проверенными системами"
              text="Подбираем профиль под задачу и бюджет — от экономичных до премиальных серий."
            />
            <div className="grid gap-4 md:grid-cols-3">
              {brands.map((b) => (
                <article key={b.id} className="card reveal flex flex-col p-7">
                  <div className="flex items-center justify-between gap-4">
                    {b.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={mediaUrl(b.logo)} alt={b.name} loading="lazy" className="h-10 w-auto max-w-[160px] object-contain" />
                    ) : (
                      <h3 className="font-display text-2xl font-semibold">{b.name}</h3>
                    )}
                    {b.country && <span className="rounded-full bg-paper px-3 py-1 text-xs font-semibold text-ink-500">{b.country}</span>}
                  </div>
                  {b.description && <p className="mt-4 text-[15px] leading-relaxed text-ink-500">{b.description}</p>}
                  {b.stats.length > 0 && (
                    <dl className="mt-auto grid grid-cols-2 gap-3 pt-6">
                      {b.stats.map((s, i) => (
                        <div key={i} className="rounded-xl bg-paper px-4 py-3">
                          <dt className="font-bold">{s.value}</dt>
                          <dd className="text-xs text-ink-500">{s.label}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </article>
              ))}
            </div>
          </>
        )}

        {certificates.length > 0 && (
          <div className={brands.length ? "mt-20" : ""}>
            <h3 className="reveal mb-6 font-display text-2xl font-semibold">Документы и сертификаты</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {certificates.map((c) => {
                const href = c.file || c.image
                const preview = c.image || (isImage(c.file) ? c.file : null)
                const body = (
                  <>
                    <span className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-paper text-gold-600">
                      {preview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={mediaUrl(preview)} alt="" loading="lazy" className="h-full w-full object-cover" />
                      ) : (
                        <FileText className="size-6" />
                      )}
                    </span>
                    <span>
                      <span className="block font-semibold leading-snug">{c.title}</span>
                      {c.description && <span className="mt-1 block text-sm text-ink-500">{c.description}</span>}
                    </span>
                  </>
                )
                return href ? (
                  <a key={c.id} href={mediaUrl(href)} target="_blank" rel="noopener noreferrer" className="card reveal flex items-center gap-4 p-4 transition hover:ring-2 hover:ring-gold-500">
                    {body}
                  </a>
                ) : (
                  <div key={c.id} className="card reveal flex items-center gap-4 p-4">
                    {body}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
