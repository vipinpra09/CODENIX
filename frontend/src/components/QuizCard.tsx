import { useMemo, useState } from 'react'
import { quizzesByTopic } from '../data/quizzes'
import { saveQuizAttempt } from '../utils/guestProgress'

interface Props {
  topic: string
  onProgressUpdate: () => void
}

export const QuizCard = ({ topic, onProgressUpdate }: Props) => {
  const questions = useMemo(() => quizzesByTopic[topic] ?? [], [topic])
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState(false)

  if (!questions.length) {
    return <p className="text-sm text-slate-500">No quiz available for this topic yet.</p>
  }

  const score = questions.reduce((acc, question) => acc + (answers[question.id] === question.correctAnswer ? 1 : 0), 0)

  return (
    <section className="space-y-3 rounded-xl border border-slate-200 p-4">
      <h2 className="font-semibold">Related MCQ quiz</h2>
      {questions.map((question) => (
        <fieldset key={question.id} className="space-y-2">
          <legend className="text-sm font-medium">{question.question}</legend>
          {question.options.map((option, index) => (
            <label key={option} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name={question.id}
                checked={answers[question.id] === index}
                onChange={() => setAnswers((state) => ({ ...state, [question.id]: index }))}
              />
              {option}
            </label>
          ))}
          {submitted && (
            <p className="text-xs text-slate-600">{question.explanation}</p>
          )}
        </fieldset>
      ))}
      <button
        className="rounded bg-brand px-4 py-2 text-sm font-semibold text-white"
        onClick={() => {
          setSubmitted(true)
          saveQuizAttempt(`${topic}-${Date.now()}`, score, questions.length)
          onProgressUpdate()
        }}
      >
        Submit quiz
      </button>
      {submitted && <p className="text-sm font-semibold text-slate-700">Score: {score}/{questions.length}</p>}
    </section>
  )
}
