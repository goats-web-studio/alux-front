import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { ProductImage } from "@/components/product-image"
import { categoryLabel } from "@/lib/config"
import { cn } from "@/lib/format"
import type { RelatedProduct } from "@/lib/types"

export function ProductCard({ product, className, priority }: { product: RelatedProduct; className?: string; priority?: boolean }) {
  return (
    <Link
      href={`/catalog/${product.slug}`}
      className={cn(
        "group reveal relative flex flex-col overflow-hidden rounded-(--radius-card) bg-white ring-1 ring-ink-900/8 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-20px_rgb(22_24_27/0.35)]",
        className
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-ink-900">
        <ProductImage
          src={product.image}
          alt={product.title}
          category={product.category}
          priority={priority}
          className="transition duration-700 group-hover:scale-105"
        />
        <span className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink-900 backdrop-blur">
          {categoryLabel(product.category)}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg leading-snug font-bold">{product.title}</h3>
        {product.shortDescription && <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-500">{product.shortDescription}</p>}
        <div className="mt-auto flex items-center justify-between pt-6">
          <span className="text-sm font-semibold text-gold-700">{product.priceFrom || "Цена по замеру"}</span>
          <span className="grid size-10 place-items-center rounded-full bg-paper transition group-hover:bg-gold-500">
            <ArrowUpRight className="size-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}
