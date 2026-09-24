"use client"

import { useState } from "react"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import { LeadForm } from "@/components/lead/lead-form"
import { cn } from "@/lib/format"

type Step = {
  id: string
  question: string
  multi?: boolean
  options: string[]
}

const STEPS: Step[] = [
  {
    id: "what",
    question: "Что нужно сделать?",
    multi: true,
    options: ["Стеклянные перегородки", "Витражи / фасад", "Алюминиевые двери", "Входная группа", "Окна", "Раздвижные системы"],
  },
  { id: "object", question: "Какой объект?", options: ["Квартира", "Частный дом", "Офис", "Магазин / ТЦ", "Кафе / ресторан", "Другое"] },
  { id: "size", question: "Примерный объём остекления?", options: ["До 10 м²", "10–30 м²", "30–100 м²", "Больше 100 м²", "Не знаю — нужен замер"] },
  { id: "when", question: "Когда планируете?", options: ["Как можно скорее", "В течение месяца", "Через 2–3 месяца", "Пока считаю бюджет"] },
]

const LABELS: Record<string, string> = { what: "Нужно", object: "Объект", size: "Объём", when: "Сроки" }

// Квиз «Расчёт стоимости»: 4 вопроса → контакты. Ответы уходят в комментарий заявки
export function Calculator() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string[]>>({})
  const isForm = step === STEPS.length
  const current = STEPS[step]
  const selected = current ? answers[current.id] ?? [] : []

  const toggle = (option: string) => {
    if (!current) return
    if (current.multi) {
      setAnswers((a) => ({
        ...a,
        [current.id]: selected.includes(option) ? selected.filter((o) => o !== option) : [...selected, option],
      }))
    } else {
      setAnswers((a) => ({ ...a, [current.id]: [option] }))
      setTimeout(() => setStep((s) => s + 1), 180)
    }
  }

  const summary = STEPS.filter((s) => answers[s.id]?.length)
    .map((s) => `${LABELS[s.id]}: ${answers[s.id].join(", ")}`)
    .join("\n")

  return (
    <section id="calc" className="py-20 md:py-28">
      <div className="container-x">
        <div className="dark relative grid overflow-hidden rounded-[2rem] bg-ink-900 text-white lg:grid-cols-[0.85fr_1.15fr]">
          <div className="mullions relative border-b border-white/10 p-8 md:p-12 lg:border-r lg:border-b-0">
            <p className="eyebrow">Расчёт стоимости</p>
            <h2 className="mt-4 font-display text-3xl leading-tight font-semibold text-balance md:text-4xl">
              Ответьте на 4 вопроса — посчитаем стоимость
            </h2>
            <p className="mt-5 leading-relaxed text-white/60">
              Подготовим 2–3 варианта решения с ценами и договоримся о бесплатном замере. Это займёт меньше минуты.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-white/75">
              {["Расчёт в течение рабочего дня", "Замер и консультация — бесплатно", "Ни к чему не обязывает"].map((t) => (
                <li key={t} className="flex items-center gap-3">
                  <Check className="size-4 text-gold-400" /> {t}
                </li>
              ))}
            </ul>

            {summary && (
              <dl className="mt-10 hidden space-y-2 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm lg:block">
                {STEPS.filter((s) => answers[s.id]?.length).map((s) => (
                  <div key={s.id} className="flex gap-2">
                    <dt className="text-white/45">{LABELS[s.id]}:</dt>
                    <dd className="font-medium">{answers[s.id].join(", ")}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>

          <div className="p-8 md:p-12">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex flex-1 gap-1.5" aria-hidden="true">
                {[...STEPS, null].map((_, i) => (
                  <span key={i} className={cn("h-1 flex-1 rounded-full transition-colors duration-500", i <= step ? "bg-gold-500" : "bg-white/10")} />
                ))}
              </div>
              <span className="text-sm text-white/50 tabular-nums">
                {Math.min(step + 1, STEPS.length + 1)} / {STEPS.length + 1}
              </span>
            </div>

            {!isForm && current ? (
              <fieldset key={current.id} className="animate-reveal">
                <legend className="mb-6 text-2xl font-bold">
                  {current.question}
                  {current.multi && <span className="mt-1 block text-sm font-normal text-white/45">Можно выбрать несколько</span>}
                </legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {current.options.map((option) => {
                    const active = selected.includes(option)
                    return (
                      <button
                        key={option}
                        type="button"
                        aria-pressed={active}
                        onClick={() => toggle(option)}
                        className={cn(
                          "flex items-center justify-between gap-3 rounded-2xl border px-5 py-4 text-left text-[15px] font-medium transition",
                          active ? "border-gold-500 bg-gold-500/10 text-white" : "border-white/10 bg-white/[0.03] text-white/80 hover:border-white/30"
                        )}
                      >
                        {option}
                        <span className={cn("grid size-5 shrink-0 place-items-center rounded-full border transition", active ? "border-gold-500 bg-gold-500 text-ink-950" : "border-white/25")}>
                          {active && <Check className="size-3" strokeWidth={3} />}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </fieldset>
            ) : (
              <div className="animate-reveal">
                <p className="mb-2 text-2xl font-bold">Куда отправить расчёт?</p>
                <p className="mb-6 text-white/55">Менеджер позвонит или напишет в WhatsApp на этот номер.</p>
                <LeadForm source="quiz" extraComment={summary} withComment={false} submitLabel="Получить расчёт" className="max-w-md" />
              </div>
            )}

            <div className="mt-8 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className={cn("inline-flex items-center gap-2 text-sm font-semibold text-white/60 transition hover:text-white", step === 0 && "invisible")}
              >
                <ArrowLeft className="size-4" /> Назад
              </button>
              {!isForm && current?.multi && (
                <button type="button" disabled={!selected.length} onClick={() => setStep((s) => s + 1)} className="btn-gold">
                  Далее <ArrowRight className="size-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
