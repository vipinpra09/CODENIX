import { Link } from 'react-router-dom'

interface Props {
  completionPercent: number
}

export const HomePage = ({ completionPercent }: Props) => (
  <section className="space-y-4">
    <article className="rounded-2xl border border-slate-200 bg-white p-6">
      <h1 className="text-2xl font-bold text-slate-900">Learn C. Build Logic.</h1>
      <p className="mt-2 text-slate-600">Follow a beginner-friendly roadmap with lessons, quizzes, and coding practice.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link to="/learn" className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">Start Learning</Link>
        <Link to="/practice" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Practice Problems</Link>
      </div>
    </article>
    <div className="grid gap-4 md:grid-cols-2">
      <article className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold">Continue Learning</h2>
        <p className="mt-2 text-sm text-slate-600">Resume from your latest unfinished topic and maintain your consistency.</p>
      </article>
      <article className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold">Completion</h2>
        <div className="mt-3 h-3 rounded bg-slate-200">
          <div className="h-3 rounded bg-brand" style={{ width: `${completionPercent}%` }} />
        </div>
        <p className="mt-2 text-sm text-slate-600">{completionPercent}% of lessons completed</p>
      </article>
    </div>
  </section>
)
