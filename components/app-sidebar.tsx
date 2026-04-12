"use client"

import Link from "next/link"

export default function AppSidebar() {
  return (
    <aside className="hidden h-full w-72 flex-col border-r border-border bg-slate-950 px-6 py-8 text-white md:flex">
      <div className="mb-10 flex items-center gap-3 text-2xl font-semibold">
        <span>🚀</span>
        <span>Modero</span>
      </div>
      <nav className="flex flex-1 flex-col gap-3 text-sm text-slate-200">
        <Link
          href="/protected"
          className="rounded-xl bg-slate-900 px-4 py-3 hover:bg-slate-800"
        >
          Dashboard
        </Link>
        <Link
          href="/auth/login"
          className="rounded-xl px-4 py-3 hover:bg-slate-800"
        >
          Login
        </Link>
        <Link
          href="/auth/sign-up"
          className="rounded-xl px-4 py-3 hover:bg-slate-800"
        >
          Sign up
        </Link>
      </nav>
      <div className="mt-auto rounded-2xl bg-slate-900 p-4 text-xs text-slate-400">
        <p className="font-semibold text-slate-100">Workspace</p>
        <p className="mt-2 leading-relaxed">
          Use the sidebar to navigate and manage your tenant dashboard.
        </p>
      </div>
    </aside>
  )
}