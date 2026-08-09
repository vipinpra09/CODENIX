import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { lessons } from '../data/lessons'
import { markLessonCompleted } from '../utils/guestProgress'
import { QuizCard } from '../components/QuizCard'

interface Props {
  onProgressUpdate: () => void
}

export const LessonPage = ({ onProgressUpdate }: Props) => {
  const { lessonId } = useParams()
  const lesson = useMemo(() => lessons.find((item) => item.id === lessonId), [lessonId])

  if (!lesson) {
    return <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">Lesson not found.</p>
  }

  const currentIndex = lessons.findIndex((item) => item.id === lesson.id)
  const previous = lessons[currentIndex - 1]
  const next = lessons[currentIndex + 1]

  return (
    <article className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
      <h1 className="text-2xl font-bold">{lesson.title}</h1>
      <p className="text-slate-600">{lesson.intro}</p>
      <section>
        <h2 className="font-semibold">Core explanation</h2>
        <p className="text-sm text-slate-700">{lesson.explanation}</p>
      </section>
      <section>
        <h2 className="font-semibold">Syntax</h2>
        <pre className="mt-2 overflow-auto rounded bg-slate-900 p-3 text-xs text-white">{lesson.syntax}</pre>
      </section>
      <section>
        <h2 className="font-semibold">Example</h2>
        <pre className="mt-2 overflow-auto rounded bg-slate-900 p-3 text-xs text-white">{lesson.code}</pre>
        <p className="mt-2 rounded bg-slate-100 p-2 text-sm"><strong>Output:</strong> {lesson.output}</p>
      </section>
      <section>
        <h2 className="font-semibold">Common mistakes</h2>
        <ul className="list-disc pl-5 text-sm text-slate-700">
          {lesson.commonMistakes.map((mistake) => <li key={mistake}>{mistake}</li>)}
        </ul>
      </section>
      <section>
        <h2 className="font-semibold">Try it yourself</h2>
        <p className="text-sm text-slate-600">Use the compiler page to experiment with this lesson.</p>
      </section>
      <QuizCard topic={lesson.mcqTopic} onProgressUpdate={onProgressUpdate} />
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => {
            markLessonCompleted(lesson.id)
            onProgressUpdate()
          }}
          className="rounded bg-brand px-4 py-2 text-sm font-semibold text-white"
        >
          Mark as completed
        </button>
        <Link className="rounded border border-slate-300 px-4 py-2 text-sm" to={`/practice?topic=${encodeURIComponent(lesson.title)}`}>
          Related problems
        </Link>
      </div>
      <nav className="flex justify-between pt-2 text-sm">
        {previous ? <Link to={`/learn/${previous.id}`} className="text-brand">← {previous.title}</Link> : <span />}
        {next ? <Link to={`/learn/${next.id}`} className="text-brand">{next.title} →</Link> : <span />}
      </nav>
    </article>
  )
}
