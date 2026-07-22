'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as supabaseService from '@/lib/supabase'
import type { Servico, TipoServico } from '@/lib/types'

export const SERVICOS_QUERY_KEY = ['servicos']

export function useServicos(veiculoId?: string) {
  return useQuery({
    queryKey: [SERVICOS_QUERY_KEY, veiculoId],
    queryFn: () => supabaseService.getServicos(veiculoId),
  })
}

export function useUltimosServicos(limite: number = 30) {
  return useQuery({
    queryKey: ['servicos', 'ultimos', limite],
    queryFn: () => supabaseService.getUltimosServicos(limite),
  })
}

export function useSearchServicos(
  query: string,
  filtros?: { tipo?: TipoServico; dataDe?: string; dataAte?: string }
) {
  return useQuery({
    queryKey: ['servicos', 'search', query, filtros],
    queryFn: () => supabaseService.searchServicos(query, filtros),
  })
}

export function useServico(id: string) {
  return useQuery({
    queryKey: ['servico', id],
    queryFn: () => supabaseService.getServico(id),
    enabled: Boolean(id),
  })
}

export function useCreateServico() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (servico: Omit<Servico, 'id' | 'numero_os' | 'created_at' | 'updated_at'>) =>
      supabaseService.createServico(servico),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: SERVICOS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ['servico', data.id] })
      queryClient.invalidateQueries({ queryKey: ['servicos', data.veiculo_id] })
    },
  })
}
