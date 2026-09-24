"use client"

import { openLead, type LeadRequest } from "./lead-dialog"

type Props = LeadRequest & {
  children: React.ReactNode
  className?: string
}

export function LeadButton({ children, className, ...request }: Props) {
  return (
    <button type="button" className={className} onClick={() => openLead(request)}>
      {children}
    </button>
  )
}
