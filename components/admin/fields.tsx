"use client"

import { useId, useRef, useState } from "react"
import { ArrowDown, ArrowUp, Eye, FileText, ImagePlus, Pencil, Plus, Trash2, Upload } from "lucide-react"
import { Markdown } from "@/components/markdown"
import { api, errorMessage } from "@/lib/admin-api"
import { mediaUrl } from "@/lib/config"
import { cn } from "@/lib/format"
import { useToast } from "./toast"
import { adminBtn, Spinner } from "./ui"

// Описание поля формы. По схеме строится редактор любого раздела CMS
export type FieldDef =
  | { name: string; label: string; type: "text"; placeholder?: string; hint?: string; required?: boolean }
  | { name: string; label: string; type: "textarea" | "markdown"; rows?: number; hint?: string }
  | { name: string; label: string; type: "number"; hint?: string }
  | { name: string; label: string; type: "date"; hint?: string }
  | { name: string; label: string; type: "switch"; hint?: string }
  | { name: string; label: string; type: "select"; options: { value: string; label: string }[]; hint?: string }
  | { name: string; label: string; type: "image" | "file"; hint?: string }
  | { name: string; label: string; type: "gallery"; hint?: string }
  | { name: string; label: string; type: "tags"; hint?: string }
  | { name: string; label: string; type: "pairs"; keys: { name: string; label: string; width?: string }[]; hint?: string; addLabel?: string }
  | { name: string; label: string; type: "section" }

export type Values = Record<string, unknown>

const labelCls = "mb-1.5 block text-sm font-semibold text-ink-700"
const hintCls = "mt-1.5 text-xs text-ink-400"

export function Fields({ fields, values, onChange }: { fields: FieldDef[]; values: Values; onChange: (name: string, value: unknown) => void }) {
  return (
    <div className="space-y-5">
      {fields.map((f) => (
        <FieldRow key={f.name} field={f} value={values[f.name]} onChange={(v) => onChange(f.name, v)} />
      ))}
    </div>
  )
}

function FieldRow({ field, value, onChange }: { field: FieldDef; value: unknown; onChange: (v: unknown) => void }) {
  const id = useId()
  if (field.type === "section") {
    return <h3 className="border-t border-ink-900/8 pt-6 text-xs font-bold tracking-[0.18em] text-ink-400 uppercase">{field.label}</h3>
  }

  const hint = "hint" in field && field.hint ? <p className={hintCls}>{field.hint}</p> : null

  switch (field.type) {
    case "text":
      return (
        <div>
          <label htmlFor={id} className={labelCls}>
            {field.label} {field.required && <span className="text-danger">*</span>}
          </label>
          <input id={id} className="field py-3" value={String(value ?? "")} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} />
          {hint}
        </div>
      )
    case "number":
      return (
        <div>
          <label htmlFor={id} className={labelCls}>{field.label}</label>
          <input id={id} type="number" className="field py-3" value={String(value ?? 0)} onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))} />
          {hint}
        </div>
      )
    case "date":
      return (
        <div>
          <label htmlFor={id} className={labelCls}>{field.label}</label>
          <input
            id={id}
            type="date"
            className="field py-3"
            value={typeof value === "string" ? value.slice(0, 10) : ""}
            onChange={(e) => onChange(e.target.value ? new Date(e.target.value).toISOString() : "")}
          />
          {hint}
        </div>
      )
    case "textarea":
      return (
        <div>
          <label htmlFor={id} className={labelCls}>{field.label}</label>
          <textarea id={id} rows={field.rows ?? 4} className="field py-3" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />
          {hint}
        </div>
      )
    case "markdown":
      return <MarkdownField id={id} label={field.label} rows={field.rows} value={String(value ?? "")} onChange={onChange} hint={hint} />
    case "switch":
      return (
        <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl bg-white px-4 py-3 ring-1 ring-ink-900/10">
          <span>
            <span className="block text-sm font-semibold">{field.label}</span>
            {hint}
          </span>
          <input type="checkbox" className="peer sr-only" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />
          <span className="relative h-6 w-11 shrink-0 rounded-full bg-ink-900/15 transition peer-checked:bg-success after:absolute after:top-0.5 after:left-0.5 after:size-5 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-5" />
        </label>
      )
    case "select":
      return (
        <div>
          <label htmlFor={id} className={labelCls}>{field.label}</label>
          <select id={id} className="field py-3" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)}>
            {field.options.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          {hint}
        </div>
      )
    case "image":
    case "file":
      return (
        <div>
          <p className={labelCls}>{field.label}</p>
          <UploadField kind={field.type} value={(value as string) || null} onChange={onChange} />
          {hint}
        </div>
      )
    case "gallery":
      return (
        <div>
          <p className={labelCls}>{field.label}</p>
          <GalleryField value={Array.isArray(value) ? (value as string[]) : []} onChange={onChange} />
          {hint}
        </div>
      )
    case "tags":
      return (
        <div>
          <label htmlFor={id} className={labelCls}>{field.label}</label>
          <TagsInput id={id} value={Array.isArray(value) ? (value as string[]) : []} onChange={onChange} />
          {hint ?? <p className={hintCls}>Через запятую</p>}
        </div>
      )
    case "pairs":
      return (
        <div>
          <p className={labelCls}>{field.label}</p>
          <PairsField keys={field.keys} addLabel={field.addLabel} value={Array.isArray(value) ? (value as Record<string, string>[]) : []} onChange={onChange} />
          {hint}
        </div>
      )
  }
}

// Храним «сырой» текст, пока поле в фокусе, чтобы запятые и пробелы не съедались при наборе
function TagsInput({ id, value, onChange }: { id: string; value: string[]; onChange: (v: string[]) => void }) {
  const [draft, setDraft] = useState<string | null>(null)
  return (
    <input
      id={id}
      className="field py-3"
      value={draft ?? value.join(", ")}
      onFocus={() => setDraft(value.join(", "))}
      onChange={(e) => {
        setDraft(e.target.value)
        onChange(e.target.value.split(",").map((s) => s.trim()).filter(Boolean))
      }}
      onBlur={() => setDraft(null)}
    />
  )
}

function MarkdownField({ id, label, rows = 14, value, onChange, hint }: { id: string; label: string; rows?: number; value: string; onChange: (v: string) => void; hint: React.ReactNode }) {
  const [preview, setPreview] = useState(false)
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-semibold text-ink-700">{label}</label>
        <button type="button" onClick={() => setPreview((v) => !v)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-700 hover:underline">
          {preview ? <Pencil className="size-3.5" /> : <Eye className="size-3.5" />}
          {preview ? "Редактировать" : "Предпросмотр"}
        </button>
      </div>
      {preview ? (
        <div className="min-h-40 rounded-xl bg-white p-5 ring-1 ring-ink-900/10">
          <Markdown>{value || "_Пусто_"}</Markdown>
        </div>
      ) : (
        <textarea id={id} rows={rows} className="field py-3 font-mono text-sm leading-relaxed" value={value} onChange={(e) => onChange(e.target.value)} />
      )}
      {hint ?? <p className={hintCls}>Markdown: **жирный**, ## Заголовок, - список, [ссылка](https://…), | таблица |</p>}
    </div>
  )
}

function useUpload() {
  const toast = useToast()
  const [busy, setBusy] = useState(false)
  const upload = async (file: File) => {
    setBusy(true)
    try {
      return (await api.upload(file)).url
    } catch (err) {
      toast(errorMessage(err), "error")
      return null
    } finally {
      setBusy(false)
    }
  }
  return { busy, upload }
}

const isImage = (p: string) => /\.(png|jpe?g|webp|avif|svg)$/i.test(p)

function UploadField({ kind, value, onChange }: { kind: "image" | "file"; value: string | null; onChange: (v: string | null) => void }) {
  const input = useRef<HTMLInputElement>(null)
  const { busy, upload } = useUpload()
  const accept = kind === "image" ? "image/jpeg,image/png,image/webp,image/avif,image/svg+xml" : "image/*,application/pdf"

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => input.current?.click()}
        className="group relative grid size-28 shrink-0 place-items-center overflow-hidden rounded-xl bg-white ring-1 ring-ink-900/10 transition hover:ring-gold-500"
      >
        {busy ? (
          <Spinner />
        ) : value && isImage(value) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={mediaUrl(value)} alt="" className="h-full w-full object-cover" />
        ) : value ? (
          <FileText className="size-8 text-ink-400" />
        ) : (
          <ImagePlus className="size-7 text-ink-300 group-hover:text-gold-600" />
        )}
      </button>
      <div className="min-w-0 space-y-2 text-sm">
        <button type="button" onClick={() => input.current?.click()} className={adminBtn.ghost}>
          <Upload className="size-4" /> {value ? "Заменить" : "Загрузить"}
        </button>
        {value && (
          <div className="flex items-center gap-3">
            <a href={mediaUrl(value)} target="_blank" rel="noopener noreferrer" className="truncate text-xs text-ink-400 hover:text-ink-900">
              {value.split("/").pop()}
            </a>
            <button type="button" onClick={() => onChange(null)} className="text-xs font-semibold text-danger hover:underline">
              Удалить
            </button>
          </div>
        )}
        <p className="text-xs text-ink-400">{kind === "image" ? "JPG, PNG, WebP до 15 МБ" : "PDF или изображение до 15 МБ"}</p>
      </div>
      <input
        ref={input}
        type="file"
        accept={accept}
        hidden
        onChange={async (e) => {
          const file = e.target.files?.[0]
          e.target.value = ""
          if (!file) return
          const url = await upload(file)
          if (url) onChange(url)
        }}
      />
    </div>
  )
}

function GalleryField({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const input = useRef<HTMLInputElement>(null)
  const { busy, upload } = useUpload()
  const move = (i: number, d: -1 | 1) => {
    const next = [...value]
    ;[next[i], next[i + d]] = [next[i + d], next[i]]
    onChange(next)
  }
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
      {value.map((src, i) => (
        <div key={src} className="group relative aspect-square overflow-hidden rounded-xl bg-white ring-1 ring-ink-900/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={mediaUrl(src)} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-x-1 bottom-1 flex justify-between opacity-0 transition group-hover:opacity-100">
            <button type="button" disabled={i === 0} onClick={() => move(i, -1)} className="grid size-7 place-items-center rounded-lg bg-white/90 disabled:opacity-30" aria-label="Левее">
              <ArrowUp className="size-3.5 -rotate-90" />
            </button>
            <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="grid size-7 place-items-center rounded-lg bg-white/90 text-danger" aria-label="Удалить">
              <Trash2 className="size-3.5" />
            </button>
            <button type="button" disabled={i === value.length - 1} onClick={() => move(i, 1)} className="grid size-7 place-items-center rounded-lg bg-white/90 disabled:opacity-30" aria-label="Правее">
              <ArrowDown className="size-3.5 -rotate-90" />
            </button>
          </div>
        </div>
      ))}
      <button type="button" onClick={() => input.current?.click()} className="grid aspect-square place-items-center rounded-xl border-2 border-dashed border-ink-900/15 text-ink-400 transition hover:border-gold-500 hover:text-gold-600">
        {busy ? <Spinner /> : <Plus className="size-6" />}
      </button>
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        multiple
        hidden
        onChange={async (e) => {
          const files = Array.from(e.target.files ?? [])
          e.target.value = ""
          const urls: string[] = []
          for (const f of files) {
            const url = await upload(f)
            if (url) urls.push(url)
          }
          if (urls.length) onChange([...value, ...urls])
        }}
      />
    </div>
  )
}

function PairsField({
  keys,
  value,
  onChange,
  addLabel = "Добавить строку",
}: {
  keys: { name: string; label: string; width?: string }[]
  value: Record<string, string>[]
  onChange: (v: Record<string, string>[]) => void
  addLabel?: string
}) {
  const update = (i: number, key: string, v: string) => onChange(value.map((row, j) => (j === i ? { ...row, [key]: v } : row)))
  const move = (i: number, d: -1 | 1) => {
    const next = [...value]
    ;[next[i], next[i + d]] = [next[i + d], next[i]]
    onChange(next)
  }
  return (
    <div className="space-y-2">
      {value.map((row, i) => (
        <div key={i} className="flex items-center gap-2">
          {keys.map((k) => (
            <input
              key={k.name}
              aria-label={k.label}
              placeholder={k.label}
              className={cn("field py-2.5 text-sm", k.width ?? "flex-1")}
              value={row[k.name] ?? ""}
              onChange={(e) => update(i, k.name, e.target.value)}
            />
          ))}
          <button type="button" className={adminBtn.icon} disabled={i === 0} onClick={() => move(i, -1)} aria-label="Выше">
            <ArrowUp className="size-4" />
          </button>
          <button type="button" className={adminBtn.danger} onClick={() => onChange(value.filter((_, j) => j !== i))} aria-label="Удалить">
            <Trash2 className="size-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...value, Object.fromEntries(keys.map((k) => [k.name, ""]))])}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-700 hover:underline"
      >
        <Plus className="size-4" /> {addLabel}
      </button>
    </div>
  )
}
