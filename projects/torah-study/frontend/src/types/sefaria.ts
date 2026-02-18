/**
 * TypeScript types for Sefaria API responses
 */

export interface Commentary {
  commentator: string
  hebrew?: string
  translation?: string
  reference: string
}

export interface TextResponse {
  reference: string
  hebrew: string
  translation?: string
  category: string
  source: string
  source_url: string
  fetched_at: string
  commentaries?: Commentary[]
}

export interface SearchResults {
  results: TextResponse[]
  total: number
  query: string
}

export interface SearchFilters {
  category?: string
  language?: string
}

export interface HealthCheck {
  status: string
  sefaria_available: boolean
  database_available: boolean
}
