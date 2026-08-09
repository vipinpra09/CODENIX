import { api, type PageResult } from './api'

export type UserRole = 'STUDENT' | 'ADMIN'
export type McqStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
export type McqDifficulty = 'BEGINNER' | 'EASY' | 'MEDIUM' | 'CHALLENGE'

export interface AdminUser {
  id: number
  name: string
  email: string
  avatarUrl?: string
  role: UserRole
  createdAt: string
}

export interface Mcq {
  id: number
  question: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correctAnswer: number
  topic: string
  difficulty: McqDifficulty
  explanation?: string
  xp: number
  status: McqStatus
  createdAt: string
  updatedAt: string
}

export interface McqInput {
  question: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correctAnswer: number
  topic: string
  difficulty: McqDifficulty
  explanation?: string
  xp: number
  status: McqStatus
}

export interface Quiz {
  id: number
  title: string
  description?: string
  topic: string
  difficulty: McqDifficulty
  passingPercentage: number
  xp: number
  status: McqStatus
  questionCount: number
  questions: Mcq[]
  createdAt: string
  updatedAt: string
}

export interface QuizInput {
  title: string
  description?: string
  topic: string
  difficulty: McqDifficulty
  passingPercentage: number
  xp: number
  status: McqStatus
  mcqIds?: number[]
}

export interface DashboardStats {
  totalUsers: number
  totalMcqs: number
  totalQuizzes: number
  publishedMcqs: number
  publishedQuizzes: number
}

export const adminApi = {
  dashboard: () => api.request<DashboardStats>('/api/admin/dashboard'),

  users: (search: string, page: number, size = 20) =>
    api.request<PageResult<AdminUser>>(`/api/admin/users?search=${encodeURIComponent(search)}&page=${page}&size=${size}`),
  updateRole: (id: number, role: UserRole) =>
    api.request<AdminUser>(`/api/admin/users/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role }) }),

  mcqs: (search: string, page: number, size = 20) =>
    api.request<PageResult<Mcq>>(`/api/admin/mcqs?search=${encodeURIComponent(search)}&page=${page}&size=${size}`),
  getMcq: (id: number) => api.request<Mcq>(`/api/admin/mcqs/${id}`),
  createMcq: (input: McqInput) => api.request<Mcq>('/api/admin/mcqs', { method: 'POST', body: JSON.stringify(input) }),
  updateMcq: (id: number, input: McqInput) =>
    api.request<Mcq>(`/api/admin/mcqs/${id}`, { method: 'PUT', body: JSON.stringify(input) }),
  deleteMcq: (id: number) => api.request<void>(`/api/admin/mcqs/${id}`, { method: 'DELETE' }),
  updateMcqStatus: (id: number, status: McqStatus) =>
    api.request<Mcq>(`/api/admin/mcqs/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  quizzes: (search: string, page: number, size = 20) =>
    api.request<PageResult<Quiz>>(`/api/admin/quizzes?search=${encodeURIComponent(search)}&page=${page}&size=${size}`),
  getQuiz: (id: number) => api.request<Quiz>(`/api/admin/quizzes/${id}`),
  createQuiz: (input: QuizInput) => api.request<Quiz>('/api/admin/quizzes', { method: 'POST', body: JSON.stringify(input) }),
  updateQuiz: (id: number, input: QuizInput) =>
    api.request<Quiz>(`/api/admin/quizzes/${id}`, { method: 'PUT', body: JSON.stringify(input) }),
  deleteQuiz: (id: number) => api.request<void>(`/api/admin/quizzes/${id}`, { method: 'DELETE' }),
  updateQuizStatus: (id: number, status: McqStatus) =>
    api.request<Quiz>(`/api/admin/quizzes/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  addQuestion: (id: number, mcqId: number) =>
    api.request<Quiz>(`/api/admin/quizzes/${id}/questions`, { method: 'POST', body: JSON.stringify({ mcqId }) }),
  removeQuestion: (id: number, mcqId: number) =>
    api.request<Quiz>(`/api/admin/quizzes/${id}/questions/${mcqId}`, { method: 'DELETE' })
}
