'use client'

import { useQuery } from '@tanstack/react-query'
import * as supabaseService from '@/lib/supabase'

export const DASHBOARD_QUERY_KEY = ['dashboard']

export function useDashboardStats() {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEY,
    queryFn: supabaseService.getDashboardStats,
  })
}
