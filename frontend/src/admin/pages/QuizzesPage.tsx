import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminApi, type McqStatus, type Quiz } from '../../services/adminApi'
import { Button, Card, EmptyState, ErrorAlert, Loading, PageHeader, Pagination, StatusBadge } from '../ui'

export const QuizzesPage = () => {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(0)
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
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
      .quizzes(debouncedSearch, page)
      .then((result) => {
        if (cancelled) return
        setQuizzes(result.content)
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

  const setStatus = async (quiz: Quiz, status: McqStatus) => {
    setBusy(quiz.id)
    setError('')
    try {
      const updated = await adminApi.updateQuizStatus(quiz.id, status)
      setQuizzes((items) => items.map((item) => (item.id === updated.id ? updated : item)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status')
    } finally {
      setBusy(null)
    }
  }

  const remove = async (quiz: Quiz) => {
    if (!window.confirm(`Delete quiz "${quiz.title}"?`)) return
    setBusy(quiz.id)
    setError('')
    try {
      await adminApi.deleteQuiz(quiz.id)
      setQuizzes((items) => items.filter((item) => item.id !== quiz.id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete quiz')
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Quizzes"
        subtitle="Group MCQs into quizzes for students."
        action={
          <Link to="/admin/quizzes/new">
            <Button>New Quiz</Button>
          </Link>
        }
      />
      <Card>
        <div className="mb-4">
          <input
            aria-label="Search quizzes"
            placeholder="Search quizzes"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full max-w-sm rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          />
        </div>
        {error && <div className="mb-4"><ErrorAlert message={error} /></div>}
        {loading ? (
          <Loading label="Loading quizzes..." />
        ) : quizzes.length === 0 ? (
          <EmptyState message="No quizzes found. Create your first quiz." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                  <th className="py-2 pr-3">Title</th>
                  <th className="py-2 pr-3">Topic</th>
                  <th className="py-2 pr-3">Questions</th>
                  <th className="py-2 pr-3">Pass %</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {quizzes.map((quiz) => (
                  <tr key={quiz.id} className="border-b border-slate-100 last:border-0">
                    <td className="max-w-xs py-2 pr-3">
                      <Link to={`/admin/quizzes/${quiz.id}`} className="font-medium text-brand hover:underline">
                        {quiz.title}
                      </Link>
                    </td>
                    <td className="py-2 pr-3 text-slate-600">{quiz.topic}</td>
                    <td className="py-2 pr-3 text-slate-600">{quiz.questionCount}</td>
                    <td className="py-2 pr-3 text-slate-600">{quiz.passingPercentage}</td>
                    <td className="py-2 pr-3"><StatusBadge status={quiz.status} /></td>
                    <td className="py-2 text-right">
                      <div className="flex justify-end gap-1.5">
                        {quiz.status === 'PUBLISHED' ? (
                          <Button variant="secondary" disabled={busy === quiz.id} onClick={() => setStatus(quiz, 'DRAFT')}>
                            Unpublish
                          </Button>
                        ) : (
                          <Button variant="secondary" disabled={busy === quiz.id} onClick={() => setStatus(quiz, 'PUBLISHED')}>
                            Publish
                          </Button>
                        )}
                        <Button variant="danger" disabled={busy === quiz.id} onClick={() => remove(quiz)}>
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
