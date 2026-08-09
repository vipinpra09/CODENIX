import type { ProgressSummary } from '../types'

interface Props {
  summary: ProgressSummary
}

export const ProgressPage = ({ summary }: Props) => (
  <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
    <h1 className="text-xl font-bold">Progress</h1>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-xl bg-blue-50 p-3"><p className="text-xs text-slate-600">Lessons</p><p className="text-lg font-bold">{summary.lessonsCompleted}/{summary.totalLessons}</p></div>
      <div className="rounded-xl bg-green-50 p-3"><p className="text-xs text-slate-600">Problems</p><p className="text-lg font-bold">{summary.problemsSolved}/{summary.totalProblems}</p></div>
      <div className="rounded-xl bg-orange-50 p-3"><p className="text-xs text-slate-600">Quizzes</p><p className="text-lg font-bold">{summary.quizzesCompleted}</p></div>
      <div className="rounded-xl bg-purple-50 p-3"><p className="text-xs text-slate-600">XP</p><p className="text-lg font-bold">{summary.xp}</p></div>
    </div>
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="rounded-xl border border-slate-200 p-3"><p className="text-xs text-slate-600">Current streak</p><p className="text-lg font-bold">{summary.currentStreak}</p></div>
      <div className="rounded-xl border border-slate-200 p-3"><p className="text-xs text-slate-600">Longest streak</p><p className="text-lg font-bold">{summary.longestStreak}</p></div>
    </div>
    <div>
      <h2 className="font-semibold">Badges</h2>
      <p className="text-sm text-slate-600">{summary.badges.length ? summary.badges.join(', ') : 'No badges yet. Keep practicing!'}</p>
    </div>
  </section>
)
