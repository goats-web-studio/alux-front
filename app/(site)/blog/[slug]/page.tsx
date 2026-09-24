import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Markdown } from "@/components/markdown"
import { ProductImage } from "@/components/product-image"
import { LeadButton } from "@/components/lead/lead-button"
import { getPost, getPosts, getSettings } from "@/lib/api"
import { SITE_URL, mediaUrl } from "@/lib/config"
import { formatDate } from "@/lib/format"

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost((await params).slug)
  if (!post) return { title: "Статья не найдена" }
  const title = post.seoTitle || post.title
  const description = post.seoDescription || post.excerpt
  return {
    title,
    description,
    keywords: post.keywords,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      publishedTime: post.publishedAt,
      images: post.coverImage ? [mediaUrl(post.coverImage)] : undefined,
    },
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const [post, settings] = await Promise.all([getPost(slug), getSettings()])
  if (!post) notFound()

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    image: post.coverImage ? mediaUrl(post.coverImage) : undefined,
    author: { "@type": "Organization", name: settings.companyName },
    publisher: { "@type": "Organization", name: settings.companyName },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
  }

  return (
    <article className="pt-32 pb-24">
      <div className="container-x max-w-3xl">
        <nav aria-label="Хлебные крошки" className="mb-8 text-sm text-ink-400">
          <Link href="/" className="hover:text-ink-900">Главная</Link> <span className="mx-2">/</span>
          <Link href="/blog" className="hover:text-ink-900">Блог</Link>
        </nav>
        <p className="text-sm text-ink-400">
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time> · {post.readTime}
        </p>
        <h1 className="mt-4 font-display text-3xl leading-tight font-semibold text-balance md:text-5xl">{post.title}</h1>
        {post.excerpt && <p className="mt-6 text-xl leading-relaxed text-ink-500">{post.excerpt}</p>}
      </div>

      {post.coverImage && (
        <div className="container-x mt-12 max-w-5xl">
          <div className="aspect-[16/9] overflow-hidden rounded-[2rem] bg-ink-900">
            <ProductImage src={post.coverImage} alt={post.title} priority />
          </div>
        </div>
      )}

      <div className="container-x mt-12 max-w-3xl">
        <Markdown>{post.content}</Markdown>

        <div className="dark mullions mt-16 rounded-[2rem] bg-ink-900 p-8 text-white md:p-10">
          <p className="font-display text-2xl font-semibold">Остались вопросы?</p>
          <p className="mt-2 mb-6 text-white/60">Приедем на бесплатный замер, всё покажем и посчитаем на месте.</p>
          <LeadButton source="blog" title="Бесплатный замер" product={`Статья: ${post.title}`} className="btn-gold">
            Записаться на замер
          </LeadButton>
        </div>

        {post.related.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 font-display text-xl font-semibold">Читайте также</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {post.related.map((r) => (
                <Link key={r.slug} href={`/blog/${r.slug}`} className="group flex items-center gap-4 rounded-2xl bg-white p-3 ring-1 ring-ink-900/8 transition hover:ring-gold-500">
                  <div className="size-20 shrink-0 overflow-hidden rounded-xl bg-ink-900">
                    <ProductImage src={r.coverImage} alt={r.title} />
                  </div>
                  <span className="font-semibold leading-snug">{r.title}</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </article>
  )
}
