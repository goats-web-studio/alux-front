const WORDS = ["Окна", "Двери", "Витражи", "Перегородки", "Входные группы", "Раздвижные системы", "Фасады"]

// Бегущая строка направлений
export function Marquee() {
  const row = [...WORDS, ...WORDS]
  return (
    <div className="relative overflow-hidden border-y border-ink-900/10 bg-gold-500 py-4 text-ink-950" aria-hidden="true">
      <div className="flex w-max animate-[marquee_40s_linear_infinite] gap-10 motion-reduce:animate-none">
        {[...row, ...row].map((w, i) => (
          <span key={i} className="flex items-center gap-10 font-display text-lg font-semibold whitespace-nowrap uppercase">
            {w}
            <span className="size-2 rotate-45 bg-ink-950" />
          </span>
        ))}
      </div>
      <style>{`@keyframes marquee { to { transform: translateX(-50%); } }`}</style>
    </div>
  )
}
