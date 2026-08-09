import type { GuestProgress } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

export interface UserProfile {
  id: string
  name: string
  email: string
  avatarUrl?: string
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
    throw new Error(`Request failed: ${response.status}`)
  }

  return (await response.json()) as T
}

export const api = {
  getCurrentUser: () => request<UserProfile | null>('/api/auth/me'),
  getProgress: () => request<GuestProgress>('/api/progress/me'),
  syncProgress: (guestProgress: GuestProgress) =>
    request<GuestProgress>('/api/progress/sync', {
      method: 'POST',
      body: JSON.stringify({ guestProgress })
    })
}
