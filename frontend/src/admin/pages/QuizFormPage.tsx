import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { adminApi, type Mcq, type McqDifficulty, type McqStatus, type QuizInput } from '../../services/adminApi'
import { Button, Card, EmptyState, ErrorAlert, Input, Loading, PageHeader, Select } from '../ui'

const difficulties: { value: McqDifficulty; label: string }[] = [
  { value: 'BEGINNER', label: 'Beginner' },
  { value: 'EASY', label: 'Easy' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'CHALLENGE', label: 'Challenge' }
]

const statuses: { value: McqStatus; label: string }[] = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'ARCHIVED', label: 'Archived' }
]

export const QuizFormPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = id !== undefined

  const [form, setForm] = useState({
    title: '',
    description: '',
    topic: '',
    difficulty: 'EASY',
    passingPercentage: '50',
    xp: '10',
    status: 'DRAFT'
  })
  const [questions, setQuestions] = useState<Mcq[]>([])
  const [available, setAvailable] = useState<Mcq[]>([])
  const [selectedMcqId, setSelectedMcqId] = useState('')
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [validation, setValidation] = useState('')

  useEffect(() => {
    let cancelled = false
    adminApi
      .mcqs('', 0, 100)
      .then((result) => {
        if (!cancelled) setAvailable(result.content)
      })
      .catch(() => undefined)
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!isEdit) return
    adminApi
      .getQuiz(Number(id))
      .then((quiz) => {
        setForm({
          title: quiz.title,
          description: quiz.description ?? '',
          topic: quiz.topic,
          difficulty: quiz.difficulty,
          passingPercentage: String(quiz.passingPercentage),
          xp: String(quiz.xp),
          status: quiz.status
        })
        setQuestions(quiz.questions)
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const addable = useMemo(() => {
    const included = new Set(questions.map((question) => question.id))
    return available.filter((mcq) => !included.has(mcq.id))
  }, [available, questions])

  const set = (field: keyof typeof form) => (value: string) => {
    setForm((state) => ({ ...state, [field]: value }))
  }

  const addQuestion = async () => {
    if (!selectedMcqId) return
    const mcq = available.find((item) => item.id === Number(selectedMcqId))
    if (!mcq) return
    setError('')
    if (isEdit) {
      try {
        const updated = await adminApi.addQuestion(Number(id), mcq.id)
        setQuestions(updated.questions)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to add MCQ')
      }
    } else {
      setQuestions((items) => [...items, mcq])
    }
    setSelectedMcqId('')
  }

  const removeQuestion = async (mcq: Mcq) => {
    setError('')
    if (isEdit) {
      try {
        const updated = await adminApi.removeQuestion(Number(id), mcq.id)
        setQuestions(updated.questions)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to remove MCQ')
      }
    } else {
      setQuestions((items) => items.filter((item) => item.id !== mcq.id))
    }
  }

  const validate = (): string | null => {
    if (!form.title.trim()) return 'Title is required'
    if (!form.topic.trim()) return 'Topic is required'
    const passing = Number(form.passingPercentage)
    if (Number.isNaN(passing) || passing < 0 || passing > 100) return 'Passing percentage must be between 0 and 100'
    const xp = Number(form.xp)
    if (Number.isNaN(xp) || xp < 0) return 'XP must be a non-negative number'
    return null
  }

  const buildInput = (status: McqStatus): QuizInput => ({
    title: form.title.trim(),
    description: form.description.trim() || undefined,
    topic: form.topic.trim(),
    difficulty: form.difficulty as McqDifficulty,
    passingPercentage: Number(form.passingPercentage),
    xp: Number(form.xp),
    status,
    mcqIds: questions.map((question) => question.id)
  })

  const save = async (status: McqStatus) => {
    const invalid = validate()
    if (invalid) {
      setValidation(invalid)
      return
    }
    setSaving(true)
    setError('')
    setValidation('')
    try {
      const input = buildInput(status)
      if (isEdit) {
        await adminApi.updateQuiz(Number(id), input)
      } else {
        await adminApi.createQuiz(input)
      }
      navigate('/admin/quizzes')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save quiz')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loading label="Loading quiz..." />

  return (
    <div className="space-y-4">
      <PageHeader title={isEdit ? 'Edit Quiz' : 'New Quiz'} subtitle="Group MCQs into a quiz." />
      <Card>
        <div className="space-y-4">
          <Input label="Title" value={form.title} onChange={set('title')} placeholder="e.g. Variables & Data Types" />
          <Input label="Description" value={form.description} onChange={set('description')} placeholder="Optional description" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input label="Topic" value={form.topic} onChange={set('topic')} placeholder="e.g. Variables" />
            <Select label="Difficulty" value={form.difficulty} onChange={set('difficulty')} options={difficulties} />
            <Input label="Passing Percentage" value={form.passingPercentage} onChange={set('passingPercentage')} type="number" />
            <Input label="XP" value={form.xp} onChange={set('xp')} type="number" />
            <Select label="Status" value={form.status} onChange={set('status')} options={statuses} />
          </div>
          {(error || validation) && <ErrorAlert message={error || validation} />}
          <div className="flex flex-wrap gap-2 pt-2">
            <Button onClick={() => save(form.status as McqStatus)} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
            <Button variant="secondary" onClick={() => save('PUBLISHED')} disabled={saving}>
              Publish
            </Button>
            <Button variant="ghost" onClick={() => navigate('/admin/quizzes')} disabled={saving}>
              Cancel
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="mb-3 text-sm font-semibold text-slate-700">Questions</h2>
        {questions.length === 0 ? (
          <EmptyState message="No questions yet. Add MCQs below." />
        ) : (
          <ol className="mb-4 space-y-2">
            {questions.map((question, index) => (
              <li key={question.id} className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 p-3 text-sm">
                <span className="flex items-start gap-2">
                  <span className="font-medium text-slate-500">{index + 1}.</span>
                  <span className="text-slate-700">{question.question}</span>
                </span>
                <Button variant="ghost" onClick={() => removeQuestion(question)}>
                  Remove
                </Button>
              </li>
            ))}
          </ol>
        )}
        <div className="flex flex-wrap items-end gap-2">
          <div className="min-w-56 flex-1">
            <Select
              label="Add MCQ"
              value={selectedMcqId}
              onChange={setSelectedMcqId}
              options={[
                { value: '', label: 'Select an MCQ...' },
                ...addable.map((mcq) => ({ value: String(mcq.id), label: mcq.question }))
              ]}
            />
          </div>
          <Button onClick={addQuestion} disabled={!selectedMcqId}>
            Add MCQ
          </Button>
        </div>
      </Card>
    </div>
  )
}
