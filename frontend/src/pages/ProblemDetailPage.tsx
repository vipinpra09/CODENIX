import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { problems } from '../data/problems'
import { markProblemSolved } from '../utils/guestProgress'

interface Props {
  onProgressUpdate: () => void
}

export const ProblemDetailPage = ({ onProgressUpdate }: Props) => {
  const { problemId } = useParams()
  const problem = useMemo(() => problems.find((item) => item.id === problemId), [problemId])

  if (!problem) {
    return <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">Problem not found.</p>
  }

  return (
    <article className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
      <h1 className="text-xl font-bold">{problem.title}</h1>
      <p className="text-sm text-slate-500">{problem.topic} · {problem.difficulty} · +{problem.xpReward} XP</p>
      <p className="text-slate-700">{problem.description}</p>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded bg-slate-100 p-3 text-sm"><strong>Input:</strong> {problem.exampleInput}</div>
        <div className="rounded bg-slate-100 p-3 text-sm"><strong>Expected output:</strong> {problem.exampleOutput}</div>
      </div>
      <pre className="overflow-auto rounded bg-slate-900 p-3 text-xs text-white">{problem.starterCode}</pre>
      <button
        onClick={() => {
          markProblemSolved(problem.id, problem.xpReward)
          onProgressUpdate()
        }}
        className="rounded bg-brand px-4 py-2 text-sm font-semibold text-white"
      >
        Mark problem solved
      </button>
    </article>
  )
}
