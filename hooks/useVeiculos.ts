'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as supabaseService from '@/lib/supabase'
import type { Veiculo } from '@/lib/types'

export const VEICULOS_QUERY_KEY = ['veiculos']

export function useVeiculos() {
  return useQuery({
    queryKey: VEICULOS_QUERY_KEY,
    queryFn: supabaseService.getVeiculos,
  })
}

export function useSearchVeiculos(query: string) {
  return useQuery({
    queryKey: ['veiculos', 'search', query],
    queryFn: () => supabaseService.searchVeiculos(query),
    enabled: Boolean(query),
  })
}

export function useVeiculo(id: string) {
  return useQuery({
    queryKey: ['veiculo', id],
    queryFn: () => supabaseService.getVeiculo(id),
    enabled: Boolean(id),
  })
}

export function useCreateVeiculo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (veiculo: Omit<Veiculo, 'id' | 'created_at' | 'updated_at'>) =>
      supabaseService.createVeiculo(veiculo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VEICULOS_QUERY_KEY })
    },
  })
}

export function useUpdateVeiculo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, veiculo }: { id: string; veiculo: Partial<Omit<Veiculo, 'id' | 'created_at' | 'updated_at'>> }) =>
      supabaseService.updateVeiculo(id, veiculo),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: VEICULOS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ['veiculo', data.id] })
    },
  })
}

export function useDeleteVeiculo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => supabaseService.deleteVeiculo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VEICULOS_QUERY_KEY })
    },
  })
}
