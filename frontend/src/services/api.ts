import type { GuestProgress } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

export interface UserProfile {
  id: string
  name: string
  email: string
  avatarUrl?: string
  role?: string
}

export interface PageResult<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

export class ApiError extends Error {
  status: number
  path?: string

  constructor(message: string, status: number, path?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.path = path
  }
}

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {})
    },
    ...init
  })

  if (!response.ok) {
    let message = `Request failed: ${response.status}`
    try {
      const body = (await response.json()) as { message?: string; status?: number; path?: string }
      if (body.message) {
        message = body.message
      }
      throw new ApiError(message, body.status ?? response.status, body.path)
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError(message, response.status)
    }
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

export const api = {
  request,
  getCurrentUser: () => request<UserProfile | null>('/api/auth/me'),
  getProgress: () => request<GuestProgress>('/api/progress/me'),
  syncProgress: (guestProgress: GuestProgress) =>
    request<GuestProgress>('/api/progress/sync', {
      method: 'POST',
      body: JSON.stringify({ guestProgress })
    })
}
