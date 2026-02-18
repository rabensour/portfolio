/**
 * React Query hook for fetching specific texts
 */

import { useQuery } from '@tanstack/react-query'
import { api } from '../services/api'

export function useTextNavigation(ref: string, includeCommentaries = false) {
  return useQuery({
    queryKey: ['text', ref, includeCommentaries],
    queryFn: () => api.getText(ref, includeCommentaries),
    enabled: !!ref, // Only fetch if ref is provided
  })
}
