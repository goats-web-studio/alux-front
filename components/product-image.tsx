import { mediaUrl } from "@/lib/config"
import { cn } from "@/lib/format"

type Props = {
  src: string | null | undefined
  alt: string
  category?: string
  className?: string
  priority?: boolean
}

// Фото из CMS или фирменная заглушка «окно с импостами», если фото ещё не загружено
export function ProductImage({ src, alt, category, className, priority }: Props) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={mediaUrl(src)}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        className={cn("h-full w-full object-cover", className)}
      />
    )
  }
  return (
    <div
      role="img"
      aria-label={alt}
      className={cn("relative h-full w-full overflow-hidden bg-gradient-to-br from-ink-800 via-ink-900 to-ink-950", className)}
    >
      <Placeholder category={category} />
    </div>
  )
}

function Placeholder({ category }: { category?: string }) {
  const stroke = "var(--color-gold-500)"
  return (
    <svg viewBox="0 0 200 250" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.14" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.02" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.08" />
        </linearGradient>
      </defs>
      {category === "doors" ? (
        <g stroke={stroke} strokeWidth="1.5" fill="url(#glass)">
          <rect x="62" y="40" width="76" height="180" />
          <rect x="72" y="52" width="56" height="156" fill="none" strokeOpacity="0.5" />
          <path d="M120 128v16" strokeWidth="3" strokeLinecap="round" />
        </g>
      ) : category === "partitions" ? (
        <g stroke={stroke} strokeWidth="1.5" fill="url(#glass)">
          <rect x="20" y="40" width="160" height="180" />
          <path d="M60 40v180M100 40v180M140 40v180" fill="none" />
          <rect x="104" y="60" width="32" height="160" fill="none" strokeOpacity="0.5" />
        </g>
      ) : category === "facades" ? (
        <g stroke={stroke} strokeWidth="1.5" fill="url(#glass)">
          <rect x="20" y="20" width="160" height="210" />
          <path d="M73 20v210M127 20v210M20 90h160M20 160h160" fill="none" />
        </g>
      ) : (
        <g stroke={stroke} strokeWidth="1.5" fill="url(#glass)">
          <path d="M50 50l100-20v190l-100-20z" />
          <path d="M100 40v170M50 115l100-5" fill="none" />
        </g>
      )}
      <path d="M0 250L200 0" stroke="#fff" strokeOpacity="0.05" strokeWidth="40" />
    </svg>
  )
}
