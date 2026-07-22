'use client'

import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  interactive?: boolean
}

export default function Card({
  children,
  className = '',
  onClick,
  interactive = false,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-card rounded-lg border border-border p-4 ${
        interactive ? 'cursor-pointer hover:border-accent hover:shadow-md transition-all' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}

interface StatCardProps {
  icone?: ReactNode
  titulo: string
  valor: string | number
  subtitulo?: string
  onClick?: () => void
  comparacao?: {
    valor: number
    tipo: 'aumento' | 'reducao'
    percentual: number
  }
}

export function StatCard({ icone, titulo, valor, subtitulo, onClick, comparacao }: StatCardProps) {
  return (
    <Card onClick={onClick} interactive={!!onClick}>
      <div className="flex items-start gap-3">
        {icone && <div className="flex-shrink-0 text-primary">{icone}</div>}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground">{titulo}</p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-2xl md:text-3xl font-bold text-card-foreground">{valor}</p>
            {comparacao && (
              <span className={`text-xs font-medium ${
                comparacao.tipo === 'aumento' ? 'text-green-600' : 'text-red-600'
              }`}>
                {comparacao.tipo === 'aumento' ? '↑' : '↓'} {comparacao.valor} ({comparacao.percentual}%)
              </span>
            )}
          </div>
          {subtitulo && (
            <p className="text-xs text-muted-foreground mt-1">{subtitulo}</p>
          )}
        </div>
      </div>
    </Card>
  )
}

interface FormCardProps {
  titulo: string
  children: ReactNode
  className?: string
}

export function FormCard({ titulo, children, className = '' }: FormCardProps) {
  return (
    <Card className={`space-y-4 ${className}`}>
      <h3 className="text-base font-semibold text-card-foreground">{titulo}</h3>
      <div className="space-y-3">{children}</div>
    </Card>
  )
}
