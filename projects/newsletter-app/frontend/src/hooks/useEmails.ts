import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../services/api'
import type { EmailFilters } from '../types/email'

export function useEmails(filters: EmailFilters = {}) {
  return useQuery({
    queryKey: ['emails', filters],
    queryFn: () => api.getEmails(filters),
    refetchInterval: 30000, // Poll every 30 seconds
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useEmail(id: string) {
  return useQuery({
    queryKey: ['email', id],
    queryFn: () => api.getEmail(id),
    enabled: !!id,
  })
}

export function useDeleteEmail() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.deleteEmail(id),
    onSuccess: () => {
      // Invalidate emails and categories queries
      queryClient.invalidateQueries({ queryKey: ['emails'] })
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}
