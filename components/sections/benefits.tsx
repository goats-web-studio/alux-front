import { Factory, Gem, Layers, MapPinned, Ruler, ShieldCheck } from "lucide-react"
import { SectionHeading } from "./section-heading"

const ITEMS = [
  { icon: Ruler, title: "Бесплатный замер", text: "Консультация — это не «просто замер», а разбор задачи, нагрузок, архитектуры и интерьера." },
  { icon: Factory, title: "Собственное производство", text: "Режем и собираем профиль сами — контролируем качество и сроки на каждом этапе." },
  { icon: Layers, title: "Любое стекло", text: "Прозрачное, матовое, тонированное, триплекс, закалённое — под безопасность и приватность." },
  { icon: ShieldCheck, title: "Без переделок после сдачи", text: "Продумываем узлы, открывание и монтаж заранее. Работаем с нагрузками и нормами." },
  { icon: Gem, title: "Премиальный вид", text: "Узкий профиль, чистая геометрия, покраска в любой цвет RAL — конструкция выглядит дорого." },
  { icon: MapPinned, title: "Астана и регионы", text: "Работаем по городу и выезжаем на объекты за город и в другие города Казахстана." },
]

export function Benefits() {
  return (
    <section className="mullions-dark bg-paper-2 py-20 md:py-28">
      <div className="container-x grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            className="mb-10 md:mb-10"
            eyebrow="Почему Alux"
            title={
              <>
                Точно. Надёжно. <span className="text-gold-600">В срок.</span>
              </>
            }
            text="Более 15 лет делаем окна, двери, витражи и перегородки для квартир, домов, офисов, клиник, ресторанов и торговых центров."
          />
          <figure className="reveal relative overflow-hidden rounded-(--radius-card)">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/production.jpg" alt="Производство Alux: сборка алюминиевого профиля" loading="lazy" className="aspect-[4/3] w-full object-cover object-[50%_60%]" />
            <figcaption className="absolute bottom-4 left-4 rounded-full bg-ink-950/80 px-4 py-2 text-xs font-semibold text-white backdrop-blur">
              Наш цех
            </figcaption>
          </figure>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2">
          {ITEMS.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="card reveal p-7" style={{ animationDelay: `${i * 40}ms` }}>
              <span className="mb-6 grid size-12 place-items-center rounded-2xl bg-ink-900 text-gold-400">
                <Icon className="size-5" />
              </span>
              <h3 className="text-lg font-bold">{title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-500">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
