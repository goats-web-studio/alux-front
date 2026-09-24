import path from "node:path"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Pin the workspace root: there is an unrelated package-lock.json higher up the tree
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    // Images come from the backend (/uploads/...), skip the optimizer
    unoptimized: true,
  },
  poweredByHeader: false,
}

export default nextConfig
