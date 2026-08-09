import { LayoutDashboard, ListChecks, Menu, PanelLeftClose, Users, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/users', label: 'Users', icon: Users, end: false },
  { to: '/admin/mcqs', label: 'MCQs', icon: ListChecks, end: false },
  { to: '/admin/quizzes', label: 'Quizzes', icon: PanelLeftClose, end: false }
]

export const AdminLayout = () => {
  const [open, setOpen] = useState(false)

  const sidebar = (
    <nav className="space-y-1">
      <div className="border-b border-slate-200 px-3 pb-3">
        <p className="text-sm font-bold text-brand">CODENIX ADMIN</p>
        <p className="text-xs text-slate-500">Content management</p>
      </div>
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${isActive ? 'bg-blue-50 font-semibold text-blue-700' : 'text-slate-700 hover:bg-slate-100'}`
          }
        >
          <item.icon size={16} />
          {item.label}
        </NavLink>
      ))}
      <div className="border-t border-slate-200 pt-3">
        <Link to="/" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100">
          ← Back to Codenix
        </Link>
      </div>
    </nav>
  )

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
          <button className="rounded border p-2 lg:hidden" onClick={() => setOpen((state) => !state)} aria-label="Toggle admin sidebar">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
          <Link to="/admin" className="text-xl font-bold text-brand">
            Codenix <span className="text-sm font-semibold text-slate-500">Admin</span>
          </Link>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 py-4 lg:grid-cols-[220px_1fr]">
        <aside className={`${open ? 'block' : 'hidden'} rounded-2xl border border-slate-200 bg-white p-3 lg:block`}>{sidebar}</aside>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
