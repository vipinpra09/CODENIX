import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { adminApi, type McqDifficulty, type McqInput, type McqStatus } from '../../services/adminApi'
import { Button, Card, ErrorAlert, Input, Loading, PageHeader, Select } from '../ui'

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

const answerOptions = [
  { value: '0', label: 'Option A' },
  { value: '1', label: 'Option B' },
  { value: '2', label: 'Option C' },
  { value: '3', label: 'Option D' }
]

const initialForm = {
  question: '',
  optionA: '',
  optionB: '',
  optionC: '',
  optionD: '',
  correctAnswer: '0',
  topic: '',
  difficulty: 'EASY',
  explanation: '',
  xp: '10',
  status: 'DRAFT'
}

export const McqFormPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = id !== undefined

  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [validation, setValidation] = useState('')

  useEffect(() => {
    if (!isEdit) return
    adminApi
      .getMcq(Number(id))
      .then((mcq) => {
        setForm({
          question: mcq.question,
          optionA: mcq.optionA,
          optionB: mcq.optionB,
          optionC: mcq.optionC,
          optionD: mcq.optionD,
          correctAnswer: String(mcq.correctAnswer),
          topic: mcq.topic,
          difficulty: mcq.difficulty,
          explanation: mcq.explanation ?? '',
          xp: String(mcq.xp),
          status: mcq.status
        })
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const set = (field: keyof typeof initialForm) => (value: string) => {
    setForm((state) => ({ ...state, [field]: value }))
  }

  const validate = (): string | null => {
    if (!form.question.trim()) return 'Question is required'
    if (!form.optionA.trim() || !form.optionB.trim() || !form.optionC.trim() || !form.optionD.trim()) {
      return 'All four options are required'
    }
    if (!form.topic.trim()) return 'Topic is required'
    const xp = Number(form.xp)
    if (Number.isNaN(xp) || xp < 0) return 'XP must be a non-negative number'
    return null
  }

  const buildInput = (status: McqStatus): McqInput => ({
    question: form.question.trim(),
    optionA: form.optionA.trim(),
    optionB: form.optionB.trim(),
    optionC: form.optionC.trim(),
    optionD: form.optionD.trim(),
    correctAnswer: Number(form.correctAnswer),
    topic: form.topic.trim(),
    difficulty: form.difficulty as McqDifficulty,
    explanation: form.explanation.trim() || undefined,
    xp: Number(form.xp),
    status
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
        await adminApi.updateMcq(Number(id), input)
      } else {
        await adminApi.createMcq(input)
      }
      navigate('/admin/mcqs')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save MCQ')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loading label="Loading MCQ..." />

  return (
    <div className="space-y-4">
      <PageHeader title={isEdit ? 'Edit MCQ' : 'New MCQ'} subtitle="Question fields shown to students." />
      <Card>
        <div className="space-y-4">
          <Input label="Question" value={form.question} onChange={set('question')} placeholder="e.g. Which data type stores decimal numbers?" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input label="Option A" value={form.optionA} onChange={set('optionA')} placeholder="int" />
            <Input label="Option B" value={form.optionB} onChange={set('optionB')} placeholder="char" />
            <Input label="Option C" value={form.optionC} onChange={set('optionC')} placeholder="float" />
            <Input label="Option D" value={form.optionD} onChange={set('optionD')} placeholder="void" />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Select label="Correct Answer" value={form.correctAnswer} onChange={set('correctAnswer')} options={answerOptions} />
            <Input label="Topic" value={form.topic} onChange={set('topic')} placeholder="e.g. Variables" />
            <Select label="Difficulty" value={form.difficulty} onChange={set('difficulty')} options={difficulties} />
            <Input label="XP" value={form.xp} onChange={set('xp')} type="number" />
            <Select label="Status" value={form.status} onChange={set('status')} options={statuses} />
          </div>
          <Input label="Explanation" value={form.explanation} onChange={set('explanation')} placeholder="Shown to students after answering (optional)" />
          {(error || validation) && <ErrorAlert message={error || validation} />}
          <div className="flex flex-wrap gap-2 pt-2">
            <Button onClick={() => save(form.status as McqStatus)} disabled={saving} type="submit">
              {saving ? 'Saving...' : 'Save'}
            </Button>
            <Button variant="secondary" onClick={() => save('PUBLISHED')} disabled={saving}>
              Publish
            </Button>
            <Button variant="ghost" onClick={() => navigate('/admin/mcqs')} disabled={saving}>
              Cancel
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
