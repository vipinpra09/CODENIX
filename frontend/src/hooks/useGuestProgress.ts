import { useMemo, useState } from 'react'
import { loadGuestProgress, toProgressSummary } from '../utils/guestProgress'

export const useGuestProgress = () => {
  const [progress, setProgress] = useState(loadGuestProgress)

  const refresh = () => {
    setProgress(loadGuestProgress())
  }

  const summary = useMemo(() => toProgressSummary(progress), [progress])

  return { progress, summary, refresh }
}
