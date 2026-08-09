import { Link } from 'react-router-dom'
import { lessons } from '../data/lessons'

export const LearnPage = () => (
  <section className="rounded-2xl border border-slate-200 bg-white p-5">
    <h1 className="text-xl font-bold">Learn C</h1>
    <ul className="mt-4 space-y-3">
      {lessons.map((lesson, index) => (
        <li key={lesson.id} className="rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">Lesson {index + 1}</p>
          <h2 className="font-semibold">{lesson.title}</h2>
          <p className="mt-1 text-sm text-slate-600">{lesson.intro}</p>
          <Link className="mt-2 inline-block text-sm font-semibold text-brand" to={`/learn/${lesson.id}`}>Open lesson →</Link>
        </li>
      ))}
    </ul>
  </section>
)
