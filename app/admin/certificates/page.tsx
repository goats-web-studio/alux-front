"use client"

import { ResourcePage } from "@/components/admin/resource-page"
import { certificates } from "@/components/admin/resources"

export default function Page() {
  return <ResourcePage config={certificates} />
}
