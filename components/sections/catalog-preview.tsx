import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { SectionHeading } from "./section-heading"
import { ProductCard } from "./product-card"
import type { ProductCard as ProductCardT } from "@/lib/types"

export function CatalogPreview({ products }: { products: ProductCardT[] }) {
  if (!products.length) return null
  return (
    <section id="catalog" className="py-20 md:py-28">
      <div className="container-x">
        <SectionHeading
          eyebrow="Что мы делаем"
          title="Конструкции из алюминия и стекла под вашу задачу"
          text="Каждый проект считаем индивидуально: профиль, стекло, фурнитура и открывание — под нагрузку, интерьер и бюджет."
          action={
            <Link href="/catalog" className="btn-dark">
              Весь каталог <ArrowRight className="size-4" />
            </Link>
          }
        />
        <div className="scrollbar-none -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 lg:grid-cols-3">
          {products.slice(0, 6).map((p) => (
            <ProductCard key={p.id} product={p} className="w-[82%] shrink-0 snap-start sm:w-auto" />
          ))}
        </div>
      </div>
    </section>
  )
}
