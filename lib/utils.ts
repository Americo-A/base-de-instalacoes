import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatarTelefone(telefone: string): string {
  return telefone.replace(/\D/g, '')
}

export function formatarTelefoneExibicao(telefone: string): string {
  const apenasNumeros = telefone.replace(/\D/g, '')
  if (apenasNumeros.length === 11) {
    return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2, 7)}-${apenasNumeros.slice(7)}`
  }
  return telefone
}

export function formatarData(data: string | Date): string {
  const date = typeof data === 'string' ? new Date(data) : data
  return date.toLocaleDateString('pt-BR')
}

export function formatarDataHora(data: string | Date): string {
  const date = typeof data === 'string' ? new Date(data) : data
  return date.toLocaleString('pt-BR')
}

export function obterLinkWhatsApp(telefone: string): string {
  const apenasNumeros = telefone.replace(/\D/g, '')
  return `https://wa.me/55${apenasNumeros}`
}

export function obterLinkLigar(telefone: string): string {
  const apenasNumeros = telefone.replace(/\D/g, '')
  return `tel:+55${apenasNumeros}`
}

export function removerAcentos(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export function normalizarBusca(str: string): string {
  return removerAcentos(str).toLowerCase().trim()
}

export function formatarTipoServico(tipo: string): string {
  const tipos: Record<string, string> = {
    instalacao: 'Instalação',
    instalacao_com_bloqueio: 'Instalação c/ Bloqueio',
    manutencao: 'Manutenção',
    remocao: 'Remoção',
  }
  return tipos[tipo] || tipo
}

export function formatarOS(numero: string | number): string {
  const numStr = String(numero).padStart(6, '0')
  return `OS #${numStr}`
}

export function gerarDataAtual(): string {
  const hoje = new Date()
  const ano = hoje.getFullYear()
  const mes = String(hoje.getMonth() + 1).padStart(2, '0')
  const dia = String(hoje.getDate()).padStart(2, '0')
  return `${ano}-${mes}-${dia}`
}

export function obterFaixa(data: string | Date): 'hoje' | 'semana' | 'mes' | 'outro' {
  const date = typeof data === 'string' ? new Date(data) : data
  const hoje = new Date()

  const diffTempo = Math.abs(hoje.getTime() - date.getTime())
  const diffDias = Math.ceil(diffTempo / (1000 * 60 * 60 * 24))

  if (diffDias === 0) return 'hoje'
  if (diffDias <= 7) return 'semana'
  if (diffDias <= 30) return 'mes'
  return 'outro'
}

export function compararComMesAnterior(
  atual: number,
  anterior: number
): { quantidade: number; percentual: number; tipo: 'aumento' | 'reducao' | 'igual' } {
  if (atual === anterior) {
    return { quantidade: 0, percentual: 0, tipo: 'igual' }
  }

  const diferenca = atual - anterior
  const percentual = anterior > 0 ? Math.round((diferenca / anterior) * 100) : 100

  return {
    quantidade: Math.abs(diferenca),
    percentual: Math.abs(percentual),
    tipo: diferenca > 0 ? 'aumento' : 'reducao',
  }
}
