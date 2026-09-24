import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { mediaUrl } from "@/lib/config"

export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose-alux">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          img: ({ src, alt }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={mediaUrl(typeof src === "string" ? src : "")} alt={alt ?? ""} loading="lazy" className="my-6 w-full rounded-2xl" />
          ),
          a: ({ href, children }) => {
            const external = href?.startsWith("http")
            return (
              <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                {children}
              </a>
            )
          },
          table: ({ children }) => (
            <div className="overflow-x-auto">
              <table>{children}</table>
            </div>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
