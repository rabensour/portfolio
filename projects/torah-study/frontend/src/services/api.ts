/**
 * API Service
 * Handles all communication with the backend API
 */

import type { SearchResults, TextResponse, SearchFilters, HealthCheck } from '../types/sefaria'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

/**
 * Handle API errors
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }))
    throw new Error(error.detail || `HTTP ${response.status}`)
  }
  return response.json()
}

export const api = {
  /**
   * Search texts via Sefaria
   */
  async search(query: string, filters?: SearchFilters): Promise<SearchResults> {
    const response = await fetch(`${API_BASE}/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, filters }),
    })
    return handleResponse<SearchResults>(response)
  },

  /**
   * Get a specific text by reference
   */
  async getText(ref: string, includeCommentaries = false): Promise<TextResponse> {
    const params = new URLSearchParams({
      include_commentaries: includeCommentaries.toString(),
    })
    const response = await fetch(
      `${API_BASE}/texts/${encodeURIComponent(ref)}?${params}`
    )
    return handleResponse<TextResponse>(response)
  },

  /**
   * Health check
   */
  async healthCheck(): Promise<HealthCheck> {
    const response = await fetch(`${API_BASE}/health`)
    return handleResponse<HealthCheck>(response)
  },
}
