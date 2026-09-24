"use client"

import { useCallback, useEffect, useState } from "react"
import { ArrowDown, ArrowUp, ExternalLink, EyeOff, Pencil, Plus, Trash2 } from "lucide-react"
import { api, errorMessage } from "@/lib/admin-api"
import { mediaUrl } from "@/lib/config"
import { Fields, type FieldDef, type Values } from "./fields"
import { useToast } from "./toast"
import { adminBtn, Badge, Empty, Loading, Modal, PageHeader, Spinner } from "./ui"

type Item = Values & { id: number }

export type ResourceConfig = {
  /** Путь API: /api/admin/<path> */
  path: string
  title: string
  description?: string
  singular: string
  fields: FieldDef[]
  defaults: Values
  /** Сортировка стрелками (есть поле sortOrder) */
  sortable?: boolean
  row: (item: Item) => { title: string; subtitle?: string; image?: string | null; hidden?: boolean; href?: string }
}

export function ResourcePage({ config }: { config: ResourceConfig }) {
  const toast = useToast()
  const [items, setItems] = useState<Item[] | null>(null)
  const [editing, setEditing] = useState<Values | null>(null)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    try {
      setItems(await api.get<Item[]>(`/${config.path}`))
    } catch (err) {
      toast(errorMessage(err), "error")
      setItems([])
    }
  }, [config.path, toast])

  useEffect(() => {
    load()
  }, [load])

  async function openEdit(item: Item) {
    // Список может не содержать тяжёлых полей (например, текст статьи) — берём полную запись
    try {
      setEditing(await api.get<Item>(`/${config.path}/${item.id}`))
    } catch (err) {
      toast(errorMessage(err), "error")
    }
  }

  async function save() {
    if (!editing) return
    setSaving(true)
    try {
      const { id, ...body } = editing as Item
      if (id) await api.put(`/${config.path}/${id}`, body)
      else await api.post(`/${config.path}`, body)
      toast("Сохранено")
      setEditing(null)
      load()
    } catch (err) {
      toast(errorMessage(err), "error")
    } finally {
      setSaving(false)
    }
  }

  async function remove(item: Item) {
    if (!confirm(`Удалить «${config.row(item).title}»? Это действие нельзя отменить.`)) return
    try {
      await api.del(`/${config.path}/${item.id}`)
      toast("Удалено")
      load()
    } catch (err) {
      toast(errorMessage(err), "error")
    }
  }

  async function move(index: number, dir: -1 | 1) {
    if (!items) return
    const next = [...items]
    ;[next[index], next[index + dir]] = [next[index + dir], next[index]]
    setItems(next)
    try {
      await api.patch(`/${config.path}/reorder`, { ids: next.map((i) => i.id) })
    } catch (err) {
      toast(errorMessage(err), "error")
      load()
    }
  }

  return (
    <>
      <PageHeader
        title={config.title}
        text={config.description}
        actions={
          <button type="button" className={adminBtn.gold} onClick={() => setEditing({ ...config.defaults })}>
            <Plus className="size-4" /> Добавить
          </button>
        }
      />

      {!items ? (
        <Loading />
      ) : !items.length ? (
        <Empty>Пока пусто. Нажмите «Добавить», чтобы создать первую запись.</Empty>
      ) : (
        <ul className="divide-y divide-ink-900/6 overflow-hidden rounded-2xl bg-white ring-1 ring-ink-900/8">
          {items.map((item, index) => {
            const row = config.row(item)
            return (
              <li key={item.id} className="flex items-center gap-4 px-4 py-3 transition hover:bg-paper/60">
                {row.image !== undefined && (
                  <div className="size-14 shrink-0 overflow-hidden rounded-lg bg-ink-900/6">
                    {row.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={mediaUrl(row.image)} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                )}
                <button type="button" onClick={() => openEdit(item)} className="min-w-0 flex-1 text-left">
                  <span className="flex items-center gap-2">
                    <span className="truncate font-semibold">{row.title}</span>
                    {row.hidden && (
                      <Badge>
                        <EyeOff className="mr-1 size-3" /> Скрыт
                      </Badge>
                    )}
                  </span>
                  {row.subtitle && <span className="mt-0.5 block truncate text-sm text-ink-500">{row.subtitle}</span>}
                </button>
                <div className="flex shrink-0 items-center gap-0.5">
                  {config.sortable && (
                    <>
                      <button type="button" className={adminBtn.icon} disabled={index === 0} onClick={() => move(index, -1)} aria-label="Выше">
                        <ArrowUp className="size-4" />
                      </button>
                      <button type="button" className={adminBtn.icon} disabled={index === items.length - 1} onClick={() => move(index, 1)} aria-label="Ниже">
                        <ArrowDown className="size-4" />
                      </button>
                    </>
                  )}
                  {row.href && !row.hidden && (
                    <a href={row.href} target="_blank" rel="noopener noreferrer" className={adminBtn.icon} aria-label="Открыть на сайте">
                      <ExternalLink className="size-4" />
                    </a>
                  )}
                  <button type="button" className={adminBtn.icon} onClick={() => openEdit(item)} aria-label="Редактировать">
                    <Pencil className="size-4" />
                  </button>
                  <button type="button" className={adminBtn.danger} onClick={() => remove(item)} aria-label="Удалить">
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <Modal
        open={Boolean(editing)}
        onClose={() => !saving && setEditing(null)}
        title={editing?.id ? `Редактирование: ${config.singular}` : `Новый: ${config.singular}`}
        wide={config.fields.some((f) => f.type === "markdown")}
        footer={
          <>
            <button type="button" className={adminBtn.ghost} onClick={() => setEditing(null)} disabled={saving}>
              Отмена
            </button>
            <button type="button" className={adminBtn.primary} onClick={save} disabled={saving}>
              {saving && <Spinner className="size-4 text-white" />} Сохранить
            </button>
          </>
        }
      >
        {editing && (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              save()
            }}
          >
            <Fields fields={config.fields} values={editing} onChange={(name, value) => setEditing((v) => ({ ...v, [name]: value }))} />
          </form>
        )}
      </Modal>
    </>
  )
}
