import { useEffect, useState } from 'react'
import { adminApi, type DashboardStats } from '../../services/adminApi'
import { Card, ErrorAlert, Loading, PageHeader } from '../ui'

const stats: { label: string; key: keyof DashboardStats; hint: string }[] = [
  { label: 'Total Users', key: 'totalUsers', hint: 'Signed-in accounts' },
  { label: 'Total MCQs', key: 'totalMcqs', hint: 'All questions' },
  { label: 'Total Quizzes', key: 'totalQuizzes', hint: 'All quizzes' },
  { label: 'Published MCQs', key: 'publishedMcqs', hint: 'Visible to students' },
  { label: 'Published Quizzes', key: 'publishedQuizzes', hint: 'Visible to students' }
]

export const DashboardPage = () => {
  const [data, setData] = useState<DashboardStats | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    adminApi.dashboard().then(setData).catch((err: Error) => setError(err.message))
  }, [])

  if (error) return <ErrorAlert message={error} />
  if (!data) return <Loading label="Loading dashboard..." />

  return (
    <div className="space-y-4">
      <PageHeader title="Dashboard" subtitle="Live statistics from the Codenix database." />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => (
          <Card key={stat.key}>
            <p className="text-sm text-slate-600">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{data[stat.key]}</p>
            <p className="mt-1 text-xs text-slate-500">{stat.hint}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
