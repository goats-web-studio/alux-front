import { CATEGORIES, categoryLabel } from "@/lib/config"
import { formatDate } from "@/lib/format"
import type { ResourceConfig } from "./resource-page"

const seo = [
  { name: "seoSection", label: "SEO", type: "section" },
  { name: "seoTitle", label: "SEO-заголовок", type: "text", hint: "Если пусто — используется название. До 60 символов" },
  { name: "seoDescription", label: "SEO-описание", type: "textarea", rows: 2, hint: "150–160 символов, для сниппета в Google/Яндекс" },
] as const

export const products: ResourceConfig = {
  path: "products",
  title: "Каталог",
  description: "Товары и услуги на сайте: карточки на главной и в каталоге, отдельные страницы",
  singular: "товар",
  sortable: true,
  defaults: { title: "", slug: "", category: "partitions", shortDescription: "", description: "", image: null, gallery: [], specs: [], priceFrom: "", seoTitle: "", seoDescription: "", isPublished: true },
  fields: [
    { name: "title", label: "Название", type: "text", required: true },
    { name: "category", label: "Категория", type: "select", options: CATEGORIES.map((c) => ({ value: c.id, label: c.plural })) },
    { name: "priceFrom", label: "Цена", type: "text", placeholder: "от 45 000 ₸/м²", hint: "Пусто — «Цена по замеру»" },
    { name: "shortDescription", label: "Краткое описание", type: "textarea", rows: 2, hint: "1–2 предложения для карточки" },
    { name: "image", label: "Главное фото", type: "image" },
    { name: "gallery", label: "Галерея", type: "gallery" },
    { name: "specs", label: "Характеристики", type: "pairs", keys: [{ name: "label", label: "Параметр", width: "w-2/5" }, { name: "value", label: "Значение" }], addLabel: "Добавить характеристику" },
    { name: "description", label: "Подробное описание", type: "markdown" },
    { name: "isPublished", label: "Показывать на сайте", type: "switch" },
    { name: "slug", label: "Адрес страницы (slug)", type: "text", hint: "Латиницей. Если пусто — сформируется из названия" },
    ...seo,
  ],
  row: (i) => ({
    title: String(i.title),
    subtitle: `${categoryLabel(String(i.category))} · ${i.priceFrom || "цена по замеру"}`,
    image: (i.image as string) ?? null,
    hidden: !i.isPublished,
    href: `/catalog/${i.slug}`,
  }),
}

export const projects: ResourceConfig = {
  path: "projects",
  title: "Объекты",
  description: "Портфолио на главной странице",
  singular: "объект",
  sortable: true,
  defaults: { title: "", city: "Астана", objectType: "", year: String(new Date().getFullYear()), area: "", description: "", image: null, gallery: [], isPublished: true },
  fields: [
    { name: "title", label: "Название", type: "text", required: true, placeholder: "Витрины бутиков в ТЦ «…»" },
    { name: "objectType", label: "Тип объекта", type: "text", placeholder: "Офис, ТЦ, Кафе, Частный дом" },
    { name: "city", label: "Город", type: "text" },
    { name: "year", label: "Год", type: "text" },
    { name: "area", label: "Что сделали / объём", type: "text", placeholder: "120 м² перегородок" },
    { name: "description", label: "Описание", type: "textarea", rows: 3 },
    { name: "image", label: "Фото", type: "image", hint: "Лучше вертикальное, 3:4" },
    { name: "gallery", label: "Дополнительные фото", type: "gallery" },
    { name: "isPublished", label: "Показывать на сайте", type: "switch" },
  ],
  row: (i) => ({
    title: String(i.title),
    subtitle: [i.objectType, i.city, i.year].filter(Boolean).join(" · "),
    image: (i.image as string) ?? null,
    hidden: !i.isPublished,
  }),
}

export const posts: ResourceConfig = {
  path: "posts",
  title: "Блог",
  description: "Статьи для SEO и доверия клиентов",
  singular: "статья",
  defaults: { title: "", slug: "", excerpt: "", content: "", coverImage: null, publishedAt: new Date().toISOString(), readTime: "", keywords: [], seoTitle: "", seoDescription: "", relatedSlugs: [], isPublished: true },
  fields: [
    { name: "title", label: "Заголовок", type: "text", required: true },
    { name: "excerpt", label: "Анонс", type: "textarea", rows: 2 },
    { name: "coverImage", label: "Обложка", type: "image" },
    { name: "content", label: "Текст статьи", type: "markdown", rows: 20 },
    { name: "publishedAt", label: "Дата публикации", type: "date" },
    { name: "isPublished", label: "Опубликована", type: "switch" },
    { name: "slug", label: "Адрес (slug)", type: "text", hint: "Латиницей. Если пусто — из заголовка" },
    { name: "readTime", label: "Время чтения", type: "text", hint: "Если пусто — посчитается автоматически" },
    { name: "keywords", label: "Ключевые слова", type: "tags" },
    { name: "relatedSlugs", label: "Похожие статьи (slug)", type: "tags" },
    ...seo,
  ],
  row: (i) => ({
    title: String(i.title),
    subtitle: `${formatDate(String(i.publishedAt))} · /blog/${i.slug}`,
    image: (i.coverImage as string) ?? null,
    hidden: !i.isPublished,
    href: `/blog/${i.slug}`,
  }),
}

export const faq: ResourceConfig = {
  path: "faq",
  title: "Вопросы и ответы",
  description: "Блок FAQ на главной (и разметка FAQ для поисковиков)",
  singular: "вопрос",
  sortable: true,
  defaults: { question: "", answer: "", isPublished: true },
  fields: [
    { name: "question", label: "Вопрос", type: "text", required: true },
    { name: "answer", label: "Ответ", type: "textarea", rows: 5 },
    { name: "isPublished", label: "Показывать на сайте", type: "switch" },
  ],
  row: (i) => ({ title: String(i.question), subtitle: String(i.answer).slice(0, 120), hidden: !i.isPublished }),
}

export const brands: ResourceConfig = {
  path: "brands",
  title: "Профильные системы",
  description: "Производители профиля и партнёры",
  singular: "бренд",
  sortable: true,
  defaults: { name: "", country: "", description: "", logo: null, youtubeUrl: "", stats: [] },
  fields: [
    { name: "name", label: "Название", type: "text", required: true },
    { name: "country", label: "Страна", type: "text" },
    { name: "logo", label: "Логотип", type: "image", hint: "Желательно SVG или PNG на прозрачном фоне" },
    { name: "description", label: "Описание", type: "textarea", rows: 3 },
    { name: "stats", label: "Показатели", type: "pairs", keys: [{ name: "value", label: "Значение", width: "w-1/3" }, { name: "label", label: "Подпись" }], addLabel: "Добавить показатель" },
  ],
  row: (i) => ({ title: String(i.name), subtitle: String(i.country || ""), image: (i.logo as string) ?? null }),
}

export const certificates: ResourceConfig = {
  path: "certificates",
  title: "Сертификаты",
  description: "Документы, сертификаты соответствия, паспорта качества",
  singular: "документ",
  sortable: true,
  defaults: { title: "", description: "", image: null, file: null },
  fields: [
    { name: "title", label: "Название", type: "text", required: true },
    { name: "description", label: "Описание", type: "textarea", rows: 2 },
    { name: "image", label: "Превью", type: "image" },
    { name: "file", label: "Файл (PDF)", type: "file" },
  ],
  row: (i) => ({ title: String(i.title), subtitle: i.file ? "PDF прикреплён" : "Без файла", image: (i.image as string) ?? null }),
}
