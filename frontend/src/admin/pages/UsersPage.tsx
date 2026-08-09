import { useEffect, useState } from 'react'
import { adminApi, type AdminUser } from '../../services/adminApi'
import { api, type UserProfile } from '../../services/api'
import { Button, Card, EmptyState, ErrorAlert, Loading, PageHeader, Pagination, RoleBadge } from '../ui'

const joinedDate = (value: string) => new Date(value).toLocaleDateString()

export const UsersPage = () => {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(0)
  const [users, setUsers] = useState<AdminUser[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null)
  const [busy, setBusy] = useState<number | null>(null)

  useEffect(() => {
    api.getCurrentUser().then(setCurrentUser).catch(() => setCurrentUser(null))
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    setPage(0)
  }, [debouncedSearch])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    adminApi
      .users(debouncedSearch, page)
      .then((result) => {
        if (cancelled) return
        setUsers(result.content)
        setTotalPages(result.totalPages)
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [debouncedSearch, page])

  const toggleRole = async (user: AdminUser) => {
    const targetRole = user.role === 'ADMIN' ? 'STUDENT' : 'ADMIN'
    const confirmed = window.confirm(`Change role of ${user.email} from ${user.role} to ${targetRole}?`)
    if (!confirmed) return
    setBusy(user.id)
    setError('')
    try {
      const updated = await adminApi.updateRole(user.id, targetRole)
      setUsers((items) => items.map((item) => (item.id === updated.id ? updated : item)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update role')
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Users" subtitle="Manage account roles." />
      <Card>
        <div className="mb-4">
          <input
            aria-label="Search users"
            placeholder="Search by name or email"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full max-w-sm rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          />
        </div>
        {error && <div className="mb-4"><ErrorAlert message={error} /></div>}
        {loading ? (
          <Loading label="Loading users..." />
        ) : users.length === 0 ? (
          <EmptyState message="No users found." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                  <th className="py-2 pr-3">Name</th>
                  <th className="py-2 pr-3">Email</th>
                  <th className="py-2 pr-3">Role</th>
                  <th className="py-2 pr-3">Joined</th>
                  <th className="py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const isSelf = currentUser != null && String(user.id) === currentUser.id
                  return (
                    <tr key={user.id} className="border-b border-slate-100 last:border-0">
                      <td className="py-2 pr-3 font-medium">{user.name}</td>
                      <td className="py-2 pr-3 text-slate-600">{user.email}</td>
                      <td className="py-2 pr-3"><RoleBadge role={user.role} /></td>
                      <td className="py-2 pr-3 text-slate-600">{joinedDate(user.createdAt)}</td>
                      <td className="py-2 text-right">
                        <Button
                          variant="secondary"
                          disabled={busy === user.id || isSelf}
                          onClick={() => toggleRole(user)}
                        >
                          {user.role === 'ADMIN' ? 'Make Student' : 'Make Admin'}
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </Card>
    </div>
  )
}
