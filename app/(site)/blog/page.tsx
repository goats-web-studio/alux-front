import type { Metadata } from "next"
import Link from "next/link"
import { ProductImage } from "@/components/product-image"
import { getPosts } from "@/lib/api"
import { formatDate } from "@/lib/format"

export const metadata: Metadata = {
  title: "Блог — советы по остеклению, перегородкам и дверям",
  description: "Статьи о выборе алюминиевых окон, дверей, витражей и стеклянных перегородок: материалы, цены, сроки и частые ошибки.",
  alternates: { canonical: "/blog" },
}

export default async function BlogPage() {
  const posts = await getPosts()
  const [first, ...rest] = posts

  return (
    <div className="pt-32 pb-24">
      <div className="container-x">
        <p className="eyebrow">Блог</p>
        <h1 className="h-section mt-4 max-w-3xl">Полезно знать до заказа</h1>

        {!first ? (
          <p className="mt-12 rounded-2xl bg-white p-10 text-center text-ink-500">Статьи скоро появятся.</p>
        ) : (
          <>
            <Link href={`/blog/${first.slug}`} className="group mt-12 grid overflow-hidden rounded-[2rem] bg-white ring-1 ring-ink-900/8 md:grid-cols-2">
              <div className="aspect-[4/3] overflow-hidden bg-ink-900 md:aspect-auto">
                <ProductImage src={first.coverImage} alt={first.title} priority className="transition duration-700 group-hover:scale-105" />
              </div>
              <div className="flex flex-col justify-center p-8 md:p-12">
                <p className="text-sm text-ink-400">
                  {formatDate(first.publishedAt)} · {first.readTime}
                </p>
                <h2 className="mt-4 font-display text-2xl leading-tight font-semibold md:text-3xl">{first.title}</h2>
                <p className="mt-4 leading-relaxed text-ink-500">{first.excerpt}</p>
                <span className="mt-8 text-sm font-semibold text-gold-700">Читать статью →</span>
              </div>
            </Link>

            {rest.length > 0 && (
              <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {rest.map((p) => (
                  <Link key={p.id} href={`/blog/${p.slug}`} className="group reveal flex flex-col overflow-hidden rounded-(--radius-card) bg-white ring-1 ring-ink-900/8">
                    <div className="aspect-[16/10] overflow-hidden bg-ink-900">
                      <ProductImage src={p.coverImage} alt={p.title} className="transition duration-700 group-hover:scale-105" />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <p className="text-xs text-ink-400">
                        {formatDate(p.publishedAt)} · {p.readTime}
                      </p>
                      <h2 className="mt-3 text-lg leading-snug font-bold">{p.title}</h2>
                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-500">{p.excerpt}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
