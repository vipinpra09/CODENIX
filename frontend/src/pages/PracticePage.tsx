import { Link, useSearchParams } from 'react-router-dom'
import { problems } from '../data/problems'

export const PracticePage = () => {
  const [params] = useSearchParams()
  const difficulty = params.get('difficulty')

  const filtered = difficulty ? problems.filter((problem) => problem.difficulty === difficulty) : problems

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <h1 className="text-xl font-bold">Practice</h1>
      <p className="text-sm text-slate-600">50+ beginner-friendly C practice problems.</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {filtered.map((problem) => (
          <article key={problem.id} className="rounded-xl border border-slate-200 p-4">
            <p className="text-xs text-slate-500">{problem.topic} · {problem.difficulty}</p>
            <h2 className="font-semibold">{problem.title}</h2>
            <p className="mt-1 text-sm text-slate-600">{problem.description}</p>
            <Link className="mt-2 inline-block text-sm font-semibold text-brand" to={`/practice/${problem.id}`}>
              Solve → (+{problem.xpReward} XP)
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}
