import type { GuestProgress, ProgressSummary } from '../types'
import { lessons } from '../data/lessons'
import { problems } from '../data/problems'

const KEY = 'codenix_guest_progress_v1'

const defaultProgress: GuestProgress = {
  completedLessons: [],
  solvedProblems: [],
  quizAttempts: [],
  badges: [],
  xp: 0,
  currentStreak: 0,
  longestStreak: 0
}

export const loadGuestProgress = (): GuestProgress => {
  const raw = localStorage.getItem(KEY)
  if (!raw) {
    return defaultProgress
  }

  try {
    return { ...defaultProgress, ...JSON.parse(raw) }
  } catch {
    return defaultProgress
  }
}

export const saveGuestProgress = (progress: GuestProgress) => {
  localStorage.setItem(KEY, JSON.stringify(progress))
}

const updateStreak = (progress: GuestProgress) => {
  const today = new Date().toISOString().slice(0, 10)
  if (progress.lastActivityDate === today) {
    return
  }

  if (!progress.lastActivityDate) {
    progress.currentStreak = 1
  } else {
    const previous = new Date(progress.lastActivityDate)
    const current = new Date(today)
    const diffDays = Math.round((current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24))
    progress.currentStreak = diffDays === 1 ? progress.currentStreak + 1 : 1
  }

  progress.longestStreak = Math.max(progress.longestStreak, progress.currentStreak)
  progress.lastActivityDate = today
}

export const markLessonCompleted = (lessonId: string) => {
  const progress = loadGuestProgress()
  if (!progress.completedLessons.includes(lessonId)) {
    progress.completedLessons.push(lessonId)
    progress.xp += 20
    updateStreak(progress)
    saveGuestProgress(progress)
  }
  return progress
}

export const markProblemSolved = (problemId: string, xp: number) => {
  const progress = loadGuestProgress()
  if (!progress.solvedProblems.includes(problemId)) {
    progress.solvedProblems.push(problemId)
    progress.xp += xp
    updateStreak(progress)
    saveGuestProgress(progress)
  }
  return progress
}

export const saveQuizAttempt = (quizId: string, score: number, total: number) => {
  const progress = loadGuestProgress()
  progress.quizAttempts.push({ quizId, score, total })
  progress.xp += 15
  updateStreak(progress)
  saveGuestProgress(progress)
  return progress
}

export const completeDailyChallenge = () => {
  const progress = loadGuestProgress()
  const today = new Date().toISOString().slice(0, 10)
  if (progress.dailyChallengeCompletedOn !== today) {
    progress.dailyChallengeCompletedOn = today
    progress.xp += 25
    updateStreak(progress)
    saveGuestProgress(progress)
  }
  return progress
}

export const mergeGuestProgress = (guest: GuestProgress, cloud: GuestProgress): GuestProgress => {
  const mergedCompletedLessons = Array.from(new Set([...cloud.completedLessons, ...guest.completedLessons]))
  const mergedSolvedProblems = Array.from(new Set([...cloud.solvedProblems, ...guest.solvedProblems]))
  const mergedQuizAttempts = [...cloud.quizAttempts]
  for (const attempt of guest.quizAttempts) {
    const duplicate = mergedQuizAttempts.some((item) => item.quizId === attempt.quizId && item.score === attempt.score)
    if (!duplicate) {
      mergedQuizAttempts.push(attempt)
    }
  }

  return {
    completedLessons: mergedCompletedLessons,
    solvedProblems: mergedSolvedProblems,
    quizAttempts: mergedQuizAttempts,
    badges: Array.from(new Set([...cloud.badges, ...guest.badges])),
    xp: Math.max(cloud.xp, 0) + Math.max(0, mergedCompletedLessons.length - cloud.completedLessons.length) * 20 +
      mergedSolvedProblems
        .filter((id) => !cloud.solvedProblems.includes(id))
        .reduce((sum, id) => sum + (problems.find((problem) => problem.id === id)?.xpReward ?? 0), 0) +
      mergedQuizAttempts
        .filter((attempt) => !cloud.quizAttempts.some((existing) => existing.quizId === attempt.quizId && existing.score === attempt.score))
        .length * 15,
    currentStreak: Math.max(guest.currentStreak, cloud.currentStreak),
    longestStreak: Math.max(guest.longestStreak, cloud.longestStreak),
    lastActivityDate: guest.lastActivityDate && cloud.lastActivityDate
      ? guest.lastActivityDate > cloud.lastActivityDate
        ? guest.lastActivityDate
        : cloud.lastActivityDate
      : guest.lastActivityDate ?? cloud.lastActivityDate,
    dailyChallengeCompletedOn: guest.dailyChallengeCompletedOn ?? cloud.dailyChallengeCompletedOn,
    syncedAt: new Date().toISOString()
  }
}

export const clearGuestProgress = () => {
  localStorage.removeItem(KEY)
}

export const toProgressSummary = (progress: GuestProgress): ProgressSummary => ({
  lessonsCompleted: progress.completedLessons.length,
  totalLessons: lessons.length,
  problemsSolved: progress.solvedProblems.length,
  totalProblems: problems.length,
  quizzesCompleted: progress.quizAttempts.length,
  xp: progress.xp,
  currentStreak: progress.currentStreak,
  longestStreak: progress.longestStreak,
  badges: progress.badges
})
