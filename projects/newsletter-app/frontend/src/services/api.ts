import type { Email, Category, EmailListResponse, EmailFilters } from '../types/email'

const API_URL = import.meta.env.VITE_API_URL || '/api'

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new ApiError(`API error: ${response.statusText}`, response.status)
  }

  return response.json()
}

export const api = {
  async getEmails(filters: EmailFilters = {}, limit = 50, offset = 0): Promise<EmailListResponse> {
    const params = new URLSearchParams()

    if (filters.category) params.append('category', filters.category)
    if (filters.search) params.append('search', filters.search)
    if (filters.actionRequired !== undefined)
      params.append('action_required', String(filters.actionRequired))

    params.append('limit', String(limit))
    params.append('offset', String(offset))

    return fetchApi<EmailListResponse>(`/emails?${params}`)
  },

  async getEmail(id: string): Promise<Email> {
    return fetchApi<Email>(`/emails/${id}`)
  },

  async deleteEmail(id: string): Promise<void> {
    await fetchApi(`/emails/${id}`, { method: 'DELETE' })
  },

  async getCategories(): Promise<Category[]> {
    return fetchApi<Category[]>('/categories')
  },
}
