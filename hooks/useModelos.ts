'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import * as supabaseService from '@/lib/supabase'

export const MODELOS_QUERY_KEY = ['modelos']

export function useModelosConhecidos() {
  return useQuery({
    queryKey: MODELOS_QUERY_KEY,
    queryFn: supabaseService.getModelosConhecidos,
  })
}

export function useModelosComConfiguracoes() {
  return useQuery({
    queryKey: ['modelos', 'com-configuracoes'],
    queryFn: supabaseService.getModelosComConfiguracoes,
  })
}

export function useModeloConhecido(marca: string, modelo: string) {
  return useQuery({
    queryKey: ['modelo', marca, modelo],
    queryFn: () => supabaseService.getModeloConhecido(marca, modelo),
    enabled: Boolean(marca && modelo),
  })
}

export function useConfiguracoesPorModelo(modeloId: string) {
  return useQuery({
    queryKey: ['configuracoes_modelo', modeloId],
    queryFn: () => supabaseService.getConfiguracoesPorModelo(modeloId),
    enabled: Boolean(modeloId),
  })
}
