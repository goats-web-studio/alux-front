import { cn } from "@/lib/format"

type Props = {
  eyebrow: string
  title: React.ReactNode
  text?: React.ReactNode
  action?: React.ReactNode
  className?: string
  center?: boolean
}

export function SectionHeading({ eyebrow, title, text, action, className, center }: Props) {
  return (
    <div className={cn("mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between", center && "items-center text-center md:flex-col md:items-center", className)}>
      <div className={cn("max-w-2xl", center && "mx-auto")}>
        <p className="eyebrow reveal">{eyebrow}</p>
        <h2 className="h-section reveal mt-4">{title}</h2>
        {text && <p className="reveal mt-5 text-lg leading-relaxed opacity-65">{text}</p>}
      </div>
      {action && <div className="reveal shrink-0">{action}</div>}
    </div>
  )
}
