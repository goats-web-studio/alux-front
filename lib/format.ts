export function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "")
  if (!digits) return ""

  let formatted = "+7"
  const phoneDigits = (digits.startsWith("7") || digits.startsWith("8") ? digits.slice(1) : digits).slice(0, 10)

  if (phoneDigits.length > 0) formatted += " (" + phoneDigits.slice(0, 3)
  if (phoneDigits.length >= 3) formatted += ") " + phoneDigits.slice(3, 6)
  if (phoneDigits.length >= 6) formatted += "-" + phoneDigits.slice(6, 8)
  if (phoneDigits.length >= 8) formatted += "-" + phoneDigits.slice(8, 10)

  return formatted
}

export const isValidPhone = (phone: string) => phone.replace(/\D/g, "").length >= 11

export function whatsappLink(phone: string, text?: string) {
  let digits = phone.replace(/\D/g, "")
  if (digits.length === 11 && digits.startsWith("8")) digits = "7" + digits.slice(1)
  if (!digits) return ""
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ""}`
}

export function formatDate(iso: string | null | undefined) {
  if (!iso) return ""
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ""
  return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" })
    .format(date)
    .replace(/\s?г\.$/, "")
}

export const cn = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(" ")
