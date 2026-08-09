import { completeDailyChallenge } from '../utils/guestProgress'

interface Props {
  onProgressUpdate: () => void
}

export const DailyChallengePage = ({ onProgressUpdate }: Props) => {
  const today = new Date().toISOString().slice(0, 10)

  return (
    <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
      <h1 className="text-xl font-bold">Daily Challenge</h1>
      <article className="rounded-xl border border-slate-200 p-4">
        <p className="text-xs text-slate-500">{today}</p>
        <h2 className="font-semibold">Sum of digits challenge</h2>
        <p className="text-sm text-slate-600">Write a C program to compute sum of digits in a positive integer.</p>
      </article>
      <button
        onClick={() => {
          completeDailyChallenge()
          onProgressUpdate()
        }}
        className="rounded bg-brand px-4 py-2 text-sm font-semibold text-white"
      >
        Mark challenge complete (+25 XP)
      </button>
    </section>
  )
}
