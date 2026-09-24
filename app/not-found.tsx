import Link from "next/link"
import { LogoMark } from "@/components/logo"

export default function NotFound() {
  return (
    <main className="dark mullions grid min-h-dvh place-items-center bg-ink-950 px-5 text-center text-white">
      <div>
        <LogoMark className="mx-auto h-16 text-white" />
        <p className="mt-8 font-display text-7xl font-semibold text-gold-400">404</p>
        <h1 className="mt-4 text-2xl font-bold">Такой страницы нет</h1>
        <p className="mt-2 text-white/60">Возможно, её перенесли или удалили.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/" className="btn-gold">На главную</Link>
          <Link href="/catalog" className="btn-ghost">Каталог</Link>
        </div>
      </div>
    </main>
  )
}
