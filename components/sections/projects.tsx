import { MapPin } from "lucide-react"
import { ProductImage } from "@/components/product-image"
import { LeadButton } from "@/components/lead/lead-button"
import { SectionHeading } from "./section-heading"
import type { Project } from "@/lib/types"

export function Projects({ projects }: { projects: Project[] }) {
  if (!projects.length) return null
  return (
    <section id="projects" className="py-20 md:py-28">
      <div className="container-x">
        <SectionHeading
          eyebrow="Портфолио"
          title="Объекты, которые мы сделали"
          text="ТЦ, офисы, кафе и частные дома. Стекло для объектов, а не для картинок."
          action={
            <LeadButton source="project" title="Хочу так же" subtitle="Расскажите об объекте — подберём решение и посчитаем стоимость." className="btn-dark">
              Хочу так же
            </LeadButton>
          }
        />
        <div className="scrollbar-none -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 lg:grid-cols-4">
          {projects.map((p) => (
            <article key={p.id} className="group reveal relative w-[78%] shrink-0 snap-start overflow-hidden rounded-(--radius-card) bg-ink-900 text-white sm:w-auto">
              <div className="aspect-[3/4]">
                <ProductImage src={p.image} alt={p.title} className="transition duration-700 group-hover:scale-105" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <div className="mb-3 flex flex-wrap gap-2 text-xs">
                  {p.objectType && <span className="rounded-full bg-gold-500 px-3 py-1 font-semibold text-ink-950">{p.objectType}</span>}
                  {p.year && <span className="rounded-full bg-white/15 px-3 py-1 backdrop-blur">{p.year}</span>}
                </div>
                <h3 className="text-lg leading-snug font-bold">{p.title}</h3>
                {p.city && (
                  <p className="mt-2 flex items-center gap-1.5 text-sm text-white/60">
                    <MapPin className="size-3.5" /> {p.city}
                    {p.area && <span className="before:mx-2 before:content-['·']">{p.area}</span>}
                  </p>
                )}
                {p.description && (
                  <p className="grid grid-rows-[0fr] text-sm leading-relaxed text-white/70 transition-all duration-500 group-hover:grid-rows-[1fr] group-hover:pt-3">
                    <span className="overflow-hidden">{p.description}</span>
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
