import type { Metadata, Viewport } from "next"
import { Manrope, Unbounded } from "next/font/google"
import { getSettings } from "@/lib/api"
import { SITE_URL } from "@/lib/config"
import "./globals.css"

const manrope = Manrope({ subsets: ["latin", "cyrillic"], variable: "--font-manrope", display: "swap" })
const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600"],
  variable: "--font-unbounded",
  display: "swap",
})

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings()
  const title = `${s.companyName} — алюминиевые окна, двери, витражи и перегородки в Астане`
  const description = s.heroSubtitle
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s | ${s.companyName}` },
    description,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: "ru_RU",
      siteName: s.companyName,
      title,
      description,
      images: [{ url: "/img/abu-dhabi-plaza.jpg", alt: s.companyName }],
    },
    icons: { icon: "/icon.svg" },
  }
}

export const viewport: Viewport = {
  themeColor: "#16181b",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${manrope.variable} ${unbounded.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
