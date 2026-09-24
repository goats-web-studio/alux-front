import { Hero } from "@/components/sections/hero"
import { Marquee } from "@/components/sections/marquee"
import { CatalogPreview } from "@/components/sections/catalog-preview"
import { Benefits } from "@/components/sections/benefits"
import { Calculator } from "@/components/sections/calculator"
import { Process } from "@/components/sections/process"
import { Projects } from "@/components/sections/projects"
import { Partners } from "@/components/sections/partners"
import { Faq } from "@/components/sections/faq"
import { Contacts } from "@/components/sections/contacts"
import { getBrands, getCertificates, getFaq, getProducts, getProjects, getSettings } from "@/lib/api"

export default async function HomePage() {
  const [settings, products, projects, brands, certificates, faq] = await Promise.all([
    getSettings(),
    getProducts(),
    getProjects(),
    getBrands(),
    getCertificates(),
    getFaq(),
  ])

  return (
    <>
      <Hero settings={settings} />
      <Marquee />
      <CatalogPreview products={products} />
      <Benefits />
      <Projects projects={projects} />
      <Process />
      <Calculator />
      <Partners brands={brands} certificates={certificates} />
      <Faq items={faq} />
      <Contacts settings={settings} />
    </>
  )
}
