import { Bell, BookOpen, Code2, Flame, Home, Target, Trophy, User, Menu, X } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { useState } from 'react'

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/learn', label: 'Learn C', icon: BookOpen },
  { to: '/practice', label: 'Practice', icon: Target },
  { to: '/compiler', label: 'Compiler', icon: Code2 },
  { to: '/daily-challenge', label: 'Daily Challenge', icon: Flame },
  { to: '/progress', label: 'Progress', icon: Trophy },
  { to: '/profile', label: 'Profile', icon: User }
]

interface LayoutProps {
  children: React.ReactNode
  xp: number
  streak: number
}

export const Layout = ({ children, xp, streak }: LayoutProps) => {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
          <button className="rounded border p-2 lg:hidden" onClick={() => setOpen((state) => !state)} aria-label="Toggle sidebar">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
          <Link to="/" className="text-xl font-bold text-brand">Codenix</Link>
          <input aria-label="Search" placeholder="Search lessons or problems" className="hidden flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm md:block" />
          <div className="ml-auto flex items-center gap-3 text-sm">
            <span className="rounded-full bg-orange-100 px-3 py-1 font-medium text-orange-700">🔥 {streak} day</span>
            <span className="rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-700">⭐ {xp} XP</span>
            <button aria-label="Notifications" className="rounded-full border border-slate-200 p-2"><Bell size={16} /></button>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 py-4 lg:grid-cols-[220px_1fr_260px]">
        <aside className={`${open ? 'block' : 'hidden'} rounded-2xl border border-slate-200 bg-white p-3 lg:block`}>
          <nav aria-label="Sidebar navigation" className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-100'}`
                }
              >
                <item.icon size={16} />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main>{children}</main>
        <aside className="hidden rounded-2xl border border-slate-200 bg-white p-4 lg:block">
          <h2 className="text-sm font-semibold text-slate-600">Progress Summary</h2>
          <div className="mt-3 space-y-3 text-sm">
            <div className="rounded-xl bg-green-50 p-3 text-green-700">Keep your streak alive daily.</div>
            <div className="rounded-xl bg-blue-50 p-3 text-blue-700">Complete lessons for +20 XP.</div>
            <div className="rounded-xl bg-purple-50 p-3 text-purple-700">Practice problems for skill growth.</div>
          </div>
        </aside>
      </div>
    </div>
  )
}
