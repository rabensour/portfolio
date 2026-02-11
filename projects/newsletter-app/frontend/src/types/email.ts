export interface Email {
  id: string
  raw_subject: string
  raw_from: string
  raw_body: string
  raw_html?: string
  received_at: string

  // AI-extracted
  title: string
  summary: string
  key_points: string[]
  category: string
  sentiment: 'positive' | 'neutral' | 'negative'
  action_required: boolean
  tags: string[]

  processed_at?: string
  created_at: string
}

export interface Category {
  id: number
  name: string
  color: string
  icon: string
  count: number
}

export interface EmailFilters {
  category?: string
  search?: string
  actionRequired?: boolean
}

export interface EmailListResponse {
  emails: Email[]
  total: number
}
