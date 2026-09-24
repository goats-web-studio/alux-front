import type { Metadata } from "next"
import Link from "next/link"
import { ProductCard } from "@/components/sections/product-card"
import { LeadButton } from "@/components/lead/lead-button"
import { getProducts } from "@/lib/api"
import { CATEGORIES } from "@/lib/config"
import { cn } from "@/lib/format"

export const metadata: Metadata = {
  title: "Каталог: окна, двери, витражи и перегородки из алюминия",
  description: "Стеклянные перегородки, витражи, алюминиевые двери, входные группы, окна и раздвижные системы. Цены, характеристики, бесплатный замер в Астане.",
  alternates: { canonical: "/catalog" },
}

export default async function CatalogPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const [{ category }, products] = await Promise.all([searchParams, getProducts()])
  const active = CATEGORIES.find((c) => c.id === category)
  const visible = active ? products.filter((p) => p.category === active.id) : products
  const present = CATEGORIES.filter((c) => products.some((p) => p.category === c.id))

  return (
    <div className="pt-32 pb-24">
      <div className="container-x">
        <nav aria-label="Хлебные крошки" className="mb-6 text-sm text-ink-400">
          <Link href="/" className="hover:text-ink-900">Главная</Link> <span className="mx-2">/</span> Каталог
        </nav>
        <h1 className="h-section max-w-3xl">{active ? active.plural : "Каталог конструкций"}</h1>
        <p className="mt-5 max-w-2xl text-lg text-ink-500">
          Цены указаны ориентировочно. Точную стоимость считаем после бесплатного замера — под ваш объект и бюджет.
        </p>

        <div className="scrollbar-none -mx-5 mt-10 mb-10 flex gap-2 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:px-0">
          {[{ id: "", label: "Все" }, ...present].map((c) => {
            const isActive = (active?.id ?? "") === c.id
            return (
              <Link
                key={c.id || "all"}
                href={c.id ? `/catalog?category=${c.id}` : "/catalog"}
                scroll={false}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "rounded-full px-5 py-2.5 text-sm font-semibold whitespace-nowrap transition",
                  isActive ? "bg-ink-900 text-white" : "bg-white text-ink-700 ring-1 ring-ink-900/10 hover:ring-ink-900/30"
                )}
              >
                {c.label}
              </Link>
            )
          })}
        </div>

        {visible.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((p, i) => (
              <ProductCard key={p.id} product={p} priority={i < 3} />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl bg-white p-10 text-center text-ink-500">В этом разделе пока нет позиций.</p>
        )}

        <div className="dark mullions mt-16 flex flex-col items-start justify-between gap-6 rounded-[2rem] bg-ink-900 p-8 text-white md:flex-row md:items-center md:p-12">
          <div>
            <p className="font-display text-2xl font-semibold">Не нашли нужное?</p>
            <p className="mt-2 text-white/60">Делаем конструкции по индивидуальным размерам и проектам. Опишите задачу — предложим решение.</p>
          </div>
          <LeadButton source="callback" title="Индивидуальный проект" className="btn-gold shrink-0">
            Обсудить проект
          </LeadButton>
        </div>
      </div>
    </div>
  )
}
