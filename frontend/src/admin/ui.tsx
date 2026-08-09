import type { ReactNode } from 'react'
import type { McqStatus, UserRole } from '../services/adminApi'

export const Card = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <section className={`rounded-2xl border border-slate-200 bg-white p-5 ${className}`}>{children}</section>
)

export const PageHeader = ({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) => (
  <div className="flex flex-wrap items-center justify-between gap-3">
    <div>
      <h1 className="text-xl font-bold">{title}</h1>
      {subtitle && <p className="text-sm text-slate-600">{subtitle}</p>}
    </div>
    {action}
  </div>
)

export const StatusBadge = ({ status }: { status: McqStatus }) => {
  const styles: Record<McqStatus, string> = {
    DRAFT: 'bg-slate-100 text-slate-700',
    PUBLISHED: 'bg-green-100 text-green-700',
    ARCHIVED: 'bg-orange-100 text-orange-700'
  }
  return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles[status]}`}>{status}</span>
}

export const RoleBadge = ({ role }: { role: UserRole }) => (
  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'}`}>
    {role}
  </span>
)

export const Loading = ({ label = 'Loading...' }: { label?: string }) => (
  <p className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500">{label}</p>
)

export const ErrorAlert = ({ message }: { message: string }) => (
  <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{message}</p>
)

export const EmptyState = ({ message }: { message: string }) => (
  <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">{message}</p>
)

export const Button = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  className = '',
  type = 'button'
}: {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  disabled?: boolean
  className?: string
  type?: 'button' | 'submit'
}) => {
  const styles = {
    primary: 'bg-brand text-white hover:bg-blue-700',
    secondary: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50',
    danger: 'border border-red-200 bg-white text-red-700 hover:bg-red-50',
    ghost: 'text-brand hover:underline'
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded px-3 py-1.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  )
}

export const Input = ({ label, value, onChange, placeholder, type = 'text' }: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
}) => (
  <label className="block">
    <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
    />
  </label>
)

export const Select = ({ label, value, onChange, options }: {
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}) => (
  <label className="block">
    <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand focus:outline-none"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </label>
)

export const Pagination = ({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (page: number) => void }) => {
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-between gap-2 pt-4 text-sm">
      <Button variant="secondary" disabled={page <= 0} onClick={() => onChange(page - 1)}>
        Previous
      </Button>
      <span className="text-slate-600">
        Page {page + 1} of {totalPages}
      </span>
      <Button variant="secondary" disabled={page >= totalPages - 1} onClick={() => onChange(page + 1)}>
        Next
      </Button>
    </div>
  )
}
