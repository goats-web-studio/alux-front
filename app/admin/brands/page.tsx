"use client"

import { ResourcePage } from "@/components/admin/resource-page"
import { brands } from "@/components/admin/resources"

export default function Page() {
  return <ResourcePage config={brands} />
}
