import { Plus } from "lucide-react"
import { SectionHeading } from "./section-heading"
import type { Faq as FaqT } from "@/lib/types"

export function Faq({ items }: { items: FaqT[] }) {
  if (!items.length) return null
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
  }
  return (
    <section id="faq" className="bg-paper-2 py-20 md:py-28">
      <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <SectionHeading eyebrow="Вопросы и ответы" title="Отвечаем до того, как вы спросите" className="lg:sticky lg:top-28 lg:self-start" />
        <div className="divide-y divide-ink-900/10 border-y border-ink-900/10">
          {items.map((f) => (
            <details key={f.id} className="group reveal py-2 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-bold">
                {f.question}
                <span className="grid size-9 shrink-0 place-items-center rounded-full border border-ink-900/15 transition group-open:rotate-45 group-open:border-gold-500 group-open:bg-gold-500">
                  <Plus className="size-4" />
                </span>
              </summary>
              <p className="max-w-2xl pb-6 leading-relaxed whitespace-pre-line text-ink-500">{f.answer}</p>
            </details>
          ))}
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </section>
  )
}
