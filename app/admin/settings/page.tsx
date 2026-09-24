"use client"

import { useEffect, useState } from "react"
import { Send } from "lucide-react"
import { api, errorMessage, type WhatsappStatus } from "@/lib/admin-api"
import { Fields, type FieldDef, type Values } from "@/components/admin/fields"
import { useToast } from "@/components/admin/toast"
import { adminBtn, Badge, Loading, PageHeader, Spinner } from "@/components/admin/ui"
import { WhatsAppIcon } from "@/components/site/icons"

const FIELDS: FieldDef[] = [
  { name: "companyName", label: "Название компании", type: "text", required: true },
  { name: "tagline", label: "Слоган", type: "text", hint: "Над заголовком первого экрана и в подвале" },
  { name: "heroTitle", label: "Заголовок первого экрана", type: "text" },
  { name: "heroSubtitle", label: "Подзаголовок первого экрана", type: "textarea", rows: 3, hint: "Также используется как описание сайта для поисковиков" },
  { name: "stats", label: "Цифры на первом экране", type: "pairs", keys: [{ name: "value", label: "Значение", width: "w-1/3" }, { name: "label", label: "Подпись" }], addLabel: "Добавить цифру" },
  { name: "contacts", label: "Контакты", type: "section" },
  { name: "phones", label: "Телефоны", type: "pairs", keys: [{ name: "display", label: "+7 701 123 45 67" }], addLabel: "Добавить телефон" },
  { name: "email", label: "Email", type: "text" },
  { name: "address", label: "Адрес", type: "text" },
  { name: "workHours", label: "Часы работы", type: "text" },
  { name: "mapUrl", label: "Ссылка на карту (2ГИС / Яндекс)", type: "text", placeholder: "https://2gis.kz/astana/..." },
  { name: "instagram", label: "Instagram", type: "text" },
  { name: "wa", label: "WhatsApp на сайте", type: "section" },
  { name: "whatsapp", label: "Номер WhatsApp для кнопки на сайте", type: "text", placeholder: "+7 701 123 45 67", hint: "Кнопка «Написать в WhatsApp» и плавающая иконка" },
  { name: "whatsappMessage", label: "Текст первого сообщения", type: "text", hint: "Подставится в чат, когда клиент нажмёт кнопку" },
]

export default function SettingsPage() {
  const toast = useToast()
  const [values, setValues] = useState<Values | null>(null)
  const [saving, setSaving] = useState(false)
  const [wa, setWa] = useState<WhatsappStatus | null>(null)
  const [testing, setTesting] = useState(false)

  useEffect(() => {
    api.get<Values>("/settings").then(setValues, (err) => toast(errorMessage(err), "error"))
    api.get<WhatsappStatus>("/whatsapp/status").then(setWa, () => {})
  }, [toast])

  async function save() {
    if (!values) return
    setSaving(true)
    try {
      // Для телефонов href формирует бэкенд из номера
      const phones = ((values.phones as { display: string }[]) ?? []).filter((p) => p.display?.trim()).map((p) => ({ display: p.display.trim() }))
      const notifyPhones = ((values.notifyPhones as string[]) ?? []).map((p) => p.trim()).filter(Boolean)
      setValues(await api.put<Values>("/settings", { ...values, phones, notifyPhones }))
      setWa(await api.get<WhatsappStatus>("/whatsapp/status"))
      toast("Настройки сохранены. Сайт обновится в течение минуты")
    } catch (err) {
      toast(errorMessage(err), "error")
    } finally {
      setSaving(false)
    }
  }

  async function test() {
    setTesting(true)
    try {
      const res = await api.post<{ ok: true; warning: string | null }>("/whatsapp/test")
      toast(res.warning ? `Отправлено частично: ${res.warning}` : "Тестовое сообщение отправлено", res.warning ? "error" : "ok")
    } catch (err) {
      toast(errorMessage(err), "error")
    } finally {
      setTesting(false)
    }
  }

  if (!values) return <Loading />

  const notify = ((values.notifyPhones as string[]) ?? []).map((value) => ({ value }))

  return (
    <>
      <PageHeader
        title="Настройки"
        text="Контакты, тексты первого экрана и WhatsApp"
        actions={
          <button type="button" className={adminBtn.primary} onClick={save} disabled={saving}>
            {saving && <Spinner className="size-4 text-white" />} Сохранить
          </button>
        }
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <form
          className="rounded-2xl bg-white p-6 ring-1 ring-ink-900/8 md:p-8"
          onSubmit={(e) => {
            e.preventDefault()
            save()
          }}
        >
          <Fields fields={FIELDS} values={values} onChange={(name, value) => setValues((v) => ({ ...v, [name]: value }))} />
        </form>

        <section id="whatsapp" className="h-fit space-y-5 rounded-2xl bg-white p-6 ring-1 ring-ink-900/8 lg:sticky lg:top-8">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-xl bg-[#25d366] text-white">
              <WhatsAppIcon className="size-6" />
            </span>
            <div>
              <h2 className="font-bold">Уведомления о заявках</h2>
              {wa && (
                <Badge tone={wa.configured ? "green" : "red"}>
                  {wa.configured ? `Работает · ${wa.provider}` : wa.provider === "none" ? "Провайдер не подключён" : "Не настроено"}
                </Badge>
              )}
            </div>
          </div>

          <p className="text-sm text-ink-500">
            Каждая заявка с сайта приходит сообщением в WhatsApp на номера ниже — с именем, телефоном, ссылкой «написать клиенту» и
            ответами калькулятора.
          </p>

          <Fields
            fields={[{ name: "notify", label: "Кому отправлять", type: "pairs", keys: [{ name: "value", label: "+7 701 123 45 67" }], addLabel: "Добавить номер" }]}
            values={{ notify }}
            onChange={(_, v) => setValues((s) => ({ ...s, notifyPhones: (v as { value: string }[]).map((r) => r.value) }))}
          />

          {wa?.provider === "none" && (
            <p className="rounded-xl bg-gold-500/10 p-4 text-sm text-ink-700">
              Подключение провайдера (Green API) делается один раз на сервере: в <code className="font-mono">.env</code> бэкенда укажите{" "}
              <code className="font-mono">WHATSAPP_PROVIDER=greenapi</code>, <code className="font-mono">GREENAPI_ID</code> и{" "}
              <code className="font-mono">GREENAPI_TOKEN</code>. Инструкция — в README бэкенда.
            </p>
          )}
          {wa?.clientReply && <p className="text-sm text-success">Автоответ клиенту включён</p>}

          <div className="flex gap-2 border-t border-ink-900/8 pt-5">
            <button type="button" className={adminBtn.primary} onClick={save} disabled={saving}>
              Сохранить
            </button>
            <button type="button" className={adminBtn.ghost} onClick={test} disabled={testing || !wa?.configured}>
              {testing ? <Spinner className="size-4" /> : <Send className="size-4" />} Тест
            </button>
          </div>
        </section>
      </div>
    </>
  )
}
