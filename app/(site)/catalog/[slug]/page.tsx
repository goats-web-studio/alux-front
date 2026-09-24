import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Check, Ruler } from "lucide-react"
import { Markdown } from "@/components/markdown"
import { ProductImage } from "@/components/product-image"
import { ProductCard } from "@/components/sections/product-card"
import { LeadButton } from "@/components/lead/lead-button"
import { WhatsAppIcon } from "@/components/site/icons"
import { getProduct, getProducts, getSettings } from "@/lib/api"
import { SITE_URL, categoryLabel, mediaUrl } from "@/lib/config"
import { whatsappLink } from "@/lib/format"

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const products = await getProducts()
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct((await params).slug)
  if (!product) return { title: "Товар не найден" }
  const title = product.seoTitle || `${product.title} в Астане`
  const description = product.seoDescription || product.shortDescription
  return {
    title,
    description,
    alternates: { canonical: `/catalog/${product.slug}` },
    openGraph: { title, description, images: product.image ? [mediaUrl(product.image)] : undefined },
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const [product, settings] = await Promise.all([getProduct(slug), getSettings()])
  if (!product) notFound()

  const images = [product.image, ...product.gallery].filter(Boolean) as string[]
  const wa = whatsappLink(settings.whatsapp, `Здравствуйте! Интересует: ${product.title}. Хочу рассчитать стоимость.`)

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: product.title,
        description: product.shortDescription,
        image: images.map(mediaUrl),
        category: categoryLabel(product.category),
        brand: { "@type": "Brand", name: settings.companyName },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Главная", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Каталог", item: `${SITE_URL}/catalog` },
          { "@type": "ListItem", position: 3, name: product.title },
        ],
      },
    ],
  }

  return (
    <article className="pt-32 pb-24">
      <div className="container-x">
        <nav aria-label="Хлебные крошки" className="mb-8 text-sm text-ink-400">
          <Link href="/" className="hover:text-ink-900">Главная</Link>
          <span className="mx-2">/</span>
          <Link href="/catalog" className="hover:text-ink-900">Каталог</Link>
          <span className="mx-2">/</span>
          <Link href={`/catalog?category=${product.category}`} className="hover:text-ink-900">{categoryLabel(product.category)}</Link>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div className="space-y-4">
            <div className="aspect-[4/3] overflow-hidden rounded-(--radius-card) bg-ink-900">
              <ProductImage src={images[0]} alt={product.title} category={product.category} priority />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-3 gap-4">
                {images.slice(1, 7).map((src) => (
                  <a key={src} href={mediaUrl(src)} target="_blank" rel="noopener noreferrer" className="aspect-square overflow-hidden rounded-2xl">
                    <ProductImage src={src} alt={product.title} className="transition hover:scale-105" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow">{categoryLabel(product.category)}</p>
            <h1 className="mt-4 font-display text-3xl leading-tight font-semibold text-balance md:text-4xl">{product.title}</h1>
            {product.shortDescription && <p className="mt-4 text-lg leading-relaxed text-ink-500">{product.shortDescription}</p>}

            <div className="mt-8 rounded-(--radius-card) bg-white p-6 ring-1 ring-ink-900/8">
              <p className="text-sm text-ink-400">Стоимость</p>
              <p className="mt-1 font-display text-3xl font-semibold">{product.priceFrom || "По замеру"}</p>
              <p className="mt-2 text-sm text-ink-500">Точная цена зависит от размеров, стекла и фурнитуры.</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <LeadButton source="product" product={product.title} title="Рассчитать стоимость" className="btn-gold py-4">
                  <Ruler className="size-4" /> Рассчитать
                </LeadButton>
                {wa && (
                  <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-wa py-4">
                    <WhatsAppIcon className="size-5" /> WhatsApp
                  </a>
                )}
              </div>
              <ul className="mt-6 space-y-2 border-t border-ink-900/8 pt-5 text-sm text-ink-700">
                {["Бесплатный замер и консультация", "Собственное производство", "Монтаж в срок по договору"].map((t) => (
                  <li key={t} className="flex items-center gap-2.5">
                    <Check className="size-4 text-gold-600" /> {t}
                  </li>
                ))}
              </ul>
            </div>

            {product.specs.length > 0 && (
              <div className="mt-8">
                <h2 className="mb-4 text-lg font-bold">Характеристики</h2>
                <dl className="divide-y divide-ink-900/8 rounded-(--radius-card) bg-white px-6 ring-1 ring-ink-900/8">
                  {product.specs.map((s, i) => (
                    <div key={i} className="grid grid-cols-[1fr_1.3fr] gap-4 py-3.5 text-[15px]">
                      <dt className="text-ink-500">{s.label}</dt>
                      <dd className="font-medium">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>

        {product.description && (
          <section className="mt-20 max-w-3xl">
            <h2 className="mb-2 font-display text-2xl font-semibold">Подробнее</h2>
            <Markdown>{product.description}</Markdown>
          </section>
        )}

        {product.related.length > 0 && (
          <section className="mt-24">
            <h2 className="mb-8 font-display text-2xl font-semibold md:text-3xl">Смотрите также</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {product.related.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </article>
  )
}
