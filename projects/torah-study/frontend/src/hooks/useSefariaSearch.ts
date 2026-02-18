/**
 * React Query hook for searching texts
 */

import { useMutation } from '@tanstack/react-query'
import { api } from '../services/api'
import type { SearchFilters } from '../types/sefaria'

interface SearchParams {
  query: string
  filters?: SearchFilters
}

export function useSefariaSearch() {
  return useMutation({
    mutationFn: async (queryOrParams: string | SearchParams) => {
      // Support both string and object params
      const query = typeof queryOrParams === 'string' ? queryOrParams : queryOrParams.query
      const filters = typeof queryOrParams === 'string' ? undefined : queryOrParams.filters

      return api.search(query, filters)
    },
  })
}
