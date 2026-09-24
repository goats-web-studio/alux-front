import { SectionHeading } from "./section-heading"

const STEPS = [
  { title: "Заявка", text: "Оставляете заявку на сайте или пишете в WhatsApp. Перезваниваем в течение 15 минут." },
  { title: "Замер и консультация", text: "Приезжаем на объект бесплатно, разбираем задачу и предлагаем варианты." },
  { title: "Проект и договор", text: "Готовим техническое решение и точную смету. Фиксируем сроки в договоре." },
  { title: "Производство", text: "Изготавливаем конструкции на своём производстве — от 10 рабочих дней." },
  { title: "Монтаж и гарантия", text: "Аккуратно монтируем, убираем за собой, сдаём объект и даём гарантию." },
]

export function Process() {
  return (
    <section id="process" className="dark relative overflow-hidden bg-ink-950 py-20 text-white md:py-28">
      <div className="mullions absolute inset-0 opacity-60" />
      <div className="container-x relative">
        <SectionHeading
          eyebrow="Как мы работаем"
          title="От заявки до готового объекта — 5 шагов"
          text="Один менеджер ведёт проект от первого звонка до сдачи. Вы всегда знаете, что происходит и когда будет готово."
        />
        <ol className="relative grid gap-10 md:grid-cols-5 md:gap-6">
          <span className="absolute top-6 right-0 left-0 hidden h-px bg-gradient-to-r from-gold-500 via-gold-500/40 to-transparent md:block" aria-hidden="true" />
          {STEPS.map((step, i) => (
            <li key={step.title} className="reveal relative flex gap-5 md:block" style={{ animationDelay: `${i * 60}ms` }}>
              <span className="relative z-10 grid size-12 shrink-0 place-items-center rounded-full border border-gold-500/60 bg-ink-950 font-display text-sm font-semibold text-gold-400">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="md:mt-7">
                <h3 className="text-lg font-bold">{step.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-white/55">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
