import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"
import { WhatsAppFab } from "@/components/site/whatsapp-fab"
import { LeadDialog } from "@/components/lead/lead-dialog"
import { getSettings } from "@/lib/api"
import { SITE_URL } from "@/lib/config"

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings()

  // Разметка организации для поисковиков
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: settings.companyName,
    description: settings.heroSubtitle,
    url: SITE_URL,
    image: `${SITE_URL}/img/abu-dhabi-plaza.jpg`,
    telephone: settings.phones[0]?.display,
    email: settings.email || undefined,
    address: settings.address ? { "@type": "PostalAddress", streetAddress: settings.address, addressCountry: "KZ" } : undefined,
    sameAs: settings.instagram ? [settings.instagram] : undefined,
  }

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-gold-500 focus:px-4 focus:py-2 focus:text-ink-950">
        Перейти к содержимому
      </a>
      <Header companyName={settings.companyName} phone={settings.phones[0]} />
      <main id="main">{children}</main>
      <Footer settings={settings} />
      <WhatsAppFab phone={settings.whatsapp} message={settings.whatsappMessage} />
      <LeadDialog />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  )
}
