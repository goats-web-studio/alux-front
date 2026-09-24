"use client"

import { ResourcePage } from "@/components/admin/resource-page"
import { posts } from "@/components/admin/resources"

export default function Page() {
  return <ResourcePage config={posts} />
}
