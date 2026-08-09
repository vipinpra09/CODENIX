import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminApi, type Mcq, type McqStatus } from '../../services/adminApi'
import { Button, Card, EmptyState, ErrorAlert, Loading, PageHeader, Pagination, StatusBadge } from '../ui'

export const McqsPage = () => {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(0)
  const [mcqs, setMcqs] = useState<Mcq[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState<number | null>(null)

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
      .mcqs(debouncedSearch, page)
      .then((result) => {
        if (cancelled) return
        setMcqs(result.content)
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

  const setStatus = async (mcq: Mcq, status: McqStatus) => {
    setBusy(mcq.id)
    setError('')
    try {
      const updated = await adminApi.updateMcqStatus(mcq.id, status)
      setMcqs((items) => items.map((item) => (item.id === updated.id ? updated : item)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status')
    } finally {
      setBusy(null)
    }
  }

  const remove = async (mcq: Mcq) => {
    if (!window.confirm(`Delete MCQ "${mcq.question.slice(0, 60)}"? This removes it from any quizzes too.`)) return
    setBusy(mcq.id)
    setError('')
    try {
      await adminApi.deleteMcq(mcq.id)
      setMcqs((items) => items.filter((item) => item.id !== mcq.id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete MCQ')
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="MCQs"
        subtitle="Create and manage practice questions."
        action={
          <Link to="/admin/mcqs/new">
            <Button>New MCQ</Button>
          </Link>
        }
      />
      <Card>
        <div className="mb-4">
          <input
            aria-label="Search MCQs"
            placeholder="Search questions"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full max-w-sm rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          />
        </div>
        {error && <div className="mb-4"><ErrorAlert message={error} /></div>}
        {loading ? (
          <Loading label="Loading MCQs..." />
        ) : mcqs.length === 0 ? (
          <EmptyState message="No MCQs found. Create your first MCQ." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                  <th className="py-2 pr-3">Question</th>
                  <th className="py-2 pr-3">Topic</th>
                  <th className="py-2 pr-3">Difficulty</th>
                  <th className="py-2 pr-3">XP</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mcqs.map((mcq) => (
                  <tr key={mcq.id} className="border-b border-slate-100 last:border-0">
                    <td className="max-w-xs py-2 pr-3">
                      <Link to={`/admin/mcqs/${mcq.id}`} className="font-medium text-brand hover:underline">
                        {mcq.question}
                      </Link>
                    </td>
                    <td className="py-2 pr-3 text-slate-600">{mcq.topic}</td>
                    <td className="py-2 pr-3 text-slate-600">{mcq.difficulty}</td>
                    <td className="py-2 pr-3 text-slate-600">{mcq.xp}</td>
                    <td className="py-2 pr-3"><StatusBadge status={mcq.status} /></td>
                    <td className="py-2 text-right">
                      <div className="flex justify-end gap-1.5">
                        {mcq.status === 'PUBLISHED' ? (
                          <Button variant="secondary" disabled={busy === mcq.id} onClick={() => setStatus(mcq, 'DRAFT')}>
                            Unpublish
                          </Button>
                        ) : (
                          <Button variant="secondary" disabled={busy === mcq.id} onClick={() => setStatus(mcq, 'PUBLISHED')}>
                            Publish
                          </Button>
                        )}
                        {mcq.status !== 'ARCHIVED' && (
                          <Button variant="secondary" disabled={busy === mcq.id} onClick={() => setStatus(mcq, 'ARCHIVED')}>
                            Archive
                          </Button>
                        )}
                        <Button variant="danger" disabled={busy === mcq.id} onClick={() => remove(mcq)}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </Card>
    </div>
  )
}
