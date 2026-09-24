export type Id = number

export type Category = "windows" | "doors" | "facades" | "partitions" | "other"

export type Phone = { display: string; href: string }
export type Stat = { value: string; label: string }
export type Spec = { label: string; value: string }

export type Settings = {
  companyName: string
  tagline: string
  heroTitle: string
  heroSubtitle: string
  phones: Phone[]
  whatsapp: string
  whatsappMessage: string
  email: string
  address: string
  workHours: string
  instagram: string
  mapUrl: string
  stats: Stat[]
}

export type ProductCard = {
  id: Id
  slug: string
  title: string
  category: Category
  shortDescription: string
  image: string | null
  gallery: string[]
  specs: Spec[]
  priceFrom: string
  sortOrder: number
}

export type RelatedProduct = Pick<ProductCard, "slug" | "title" | "image" | "shortDescription" | "priceFrom" | "category">

export type Product = ProductCard & {
  description: string
  seoTitle: string
  seoDescription: string
  related: RelatedProduct[]
}

export type Project = {
  id: Id
  title: string
  city: string
  objectType: string
  year: string
  area: string
  description: string
  image: string | null
  gallery: string[]
  sortOrder: number
}

export type BrandStat = { icon: string; value: string; label: string }

export type Brand = {
  id: Id
  name: string
  country: string
  description: string
  logo: string | null
  youtubeUrl: string | null
  stats: BrandStat[]
  sortOrder: number
}

export type Certificate = {
  id: Id
  title: string
  description: string
  image: string | null
  file: string | null
  sortOrder: number
}

export type Faq = { id: Id; question: string; answer: string; sortOrder: number }

export type PostSummary = {
  id: Id
  slug: string
  title: string
  excerpt: string
  coverImage: string | null
  publishedAt: string
  readTime: string
  keywords: string[]
  seoTitle: string
  seoDescription: string
}

export type Post = PostSummary & {
  content: string
  related: { slug: string; title: string; coverImage: string | null }[]
}

export type LeadSource = "hero" | "contacts" | "product" | "quiz" | "blog" | "callback" | "project"

export type LeadPayload = {
  name: string
  phone: string
  email?: string
  comment?: string
  source?: LeadSource
  product?: string
  website?: string
}
