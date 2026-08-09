export type Difficulty = 'Beginner' | 'Easy' | 'Medium' | 'Challenge'

export interface Lesson {
  id: string
  title: string
  intro: string
  explanation: string
  syntax: string
  code: string
  output: string
  commonMistakes: string[]
  mcqTopic: string
}

export interface Problem {
  id: string
  title: string
  difficulty: Difficulty
  topic: string
  description: string
  exampleInput: string
  exampleOutput: string
  starterCode: string
  xpReward: number
}

export interface QuizQuestion {
  id: string
  topic: string
  difficulty: Difficulty
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

export interface GuestProgress {
  completedLessons: string[]
  solvedProblems: string[]
  quizAttempts: { quizId: string; score: number; total: number }[]
  badges: string[]
  xp: number
  currentStreak: number
  longestStreak: number
  lastActivityDate?: string
  dailyChallengeCompletedOn?: string
  syncedAt?: string
}

export interface ProgressSummary {
  lessonsCompleted: number
  totalLessons: number
  problemsSolved: number
  totalProblems: number
  quizzesCompleted: number
  xp: number
  currentStreak: number
  longestStreak: number
  badges: string[]
}
