import { useQuery } from '@tanstack/react-query'
import { api } from '../services/api'

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => api.getCategories(),
    staleTime: 60 * 1000, // 1 minute
  })
}
