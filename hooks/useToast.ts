import { useState, useCallback } from 'react'
import { ToastType } from '@/components/Toast'

interface ToastItem {
  id: string
  mensagem: string
  tipo: ToastType
  duracao?: number
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const adicionarToast = useCallback((
    mensagem: string,
    tipo: ToastType = 'info',
    duracao = 3000
  ) => {
    const id = Date.now().toString()
    setToasts((prev) => [...prev, { id, mensagem, tipo, duracao }])
    return id
  }, [])

  const removerToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const sucesso = useCallback(
    (mensagem: string) => adicionarToast(mensagem, 'sucesso'),
    [adicionarToast]
  )

  const erro = useCallback(
    (mensagem: string) => adicionarToast(mensagem, 'erro'),
    [adicionarToast]
  )

  const aviso = useCallback(
    (mensagem: string) => adicionarToast(mensagem, 'aviso'),
    [adicionarToast]
  )

  const info = useCallback(
    (mensagem: string) => adicionarToast(mensagem, 'info'),
    [adicionarToast]
  )

  const adicionar = useCallback(
    (config: { mensagem: string; tipo?: ToastType; duracao?: number }) => {
      return adicionarToast(config.mensagem, config.tipo || 'info', config.duracao)
    },
    [adicionarToast]
  )

  return {
    toasts,
    adicionarToast,
    removerToast,
    sucesso,
    erro,
    aviso,
    info,
    adicionar,
  }
}
