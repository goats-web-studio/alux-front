"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LoaderCircle } from "lucide-react"
import { LogoMark } from "@/components/logo"
import { api, errorMessage, setToken } from "@/lib/admin-api"

export default function LoginPage() {
  const router = useRouter()
  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const { token } = await api.login(login.trim(), password)
      setToken(token)
      router.replace("/admin")
    } catch (err) {
      setError(errorMessage(err))
      setLoading(false)
    }
  }

  return (
    <main className="dark mullions grid min-h-dvh place-items-center bg-ink-950 px-5 text-white">
      <form onSubmit={submit} className="w-full max-w-sm rounded-3xl border border-white/10 bg-ink-900 p-8 shadow-2xl">
        <LogoMark className="h-10 text-white" />
        <h1 className="mt-6 font-display text-2xl font-semibold">Вход в админку</h1>
        <p className="mt-1 mb-6 text-sm text-white/50">Управление сайтом и заявками</p>
        <div className="space-y-3">
          <input className="field" placeholder="Логин" autoComplete="username" value={login} onChange={(e) => setLogin(e.target.value)} autoFocus />
          <input className="field" type="password" placeholder="Пароль" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <p role="alert" className="rounded-lg bg-danger/15 px-3 py-2 text-sm text-red-300">{error}</p>}
          <button type="submit" className="btn-gold w-full py-4" disabled={loading || !login || !password}>
            {loading && <LoaderCircle className="size-4 animate-spin" />} Войти
          </button>
        </div>
      </form>
    </main>
  )
}
