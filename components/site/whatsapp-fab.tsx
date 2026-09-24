import { whatsappLink } from "@/lib/format"
import { WhatsAppIcon } from "./icons"

export function WhatsAppFab({ phone, message }: { phone: string; message: string }) {
  const href = whatsappLink(phone, message)
  if (!href) return null
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Написать в WhatsApp"
      className="group fixed right-5 bottom-5 z-30 flex items-center gap-3 rounded-full bg-[#25d366] p-3.5 text-white shadow-[0_10px_30px_-5px_rgb(37_211_102/0.55)] transition hover:scale-105 md:right-8 md:bottom-8"
    >
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25d366]/40 [animation-duration:2.5s]" />
      <WhatsAppIcon className="size-7" />
    </a>
  )
}
