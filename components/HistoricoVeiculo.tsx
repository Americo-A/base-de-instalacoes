'use client'

import { useState } from 'react'
import { Calendar, Wrench, ChevronDown } from 'lucide-react'
import Header from './Header'
import Card from './Card'
import { Veiculo, Servico } from '@/lib/types'
import { useServicos } from '@/hooks/useServicos'
import ConfirmDialog from './ConfirmDialog'
import { formatarTipoServico, formatarData } from '@/lib/utils'

interface HistoricoVeiculoProps {
  veiculo: Veiculo
  onVoltar?: () => void
  onAbrirServico?: (servico: Servico) => void
}

export default function HistoricoVeiculo({
  veiculo,
  onVoltar,
  onAbrirServico,
}: HistoricoVeiculoProps) {
  const { data: servicos = [], isLoading } = useServicos(veiculo.id)
  const [servicoSelecionado, setServicoSelecionado] = useState<Servico | null>(null)
  const [mostrarConfirm, setMostrarConfirm] = useState(false)
  const [expandidos, setExpandidos] = useState<Set<string>>(new Set())

  const toggleExpandido = (id: string) => {
    const novoExpandidos = new Set(expandidos)
    if (novoExpandidos.has(id)) {
      novoExpandidos.delete(id)
    } else {
      novoExpandidos.add(id)
    }
    setExpandidos(novoExpandidos)
  }

  const handleAbrirServico = (servico: Servico) => {
    setServicoSelecionado(servico)
    setMostrarConfirm(true)
  }

  return (
    <>
      <Header onVoltar={onVoltar} />

      <main className="pb-20 md:pb-8">
        <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-6">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-primary" />
            <h1 className="text-lg font-semibold">Histórico de Serviços</h1>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-secondary rounded-lg animate-pulse" />
              ))}
            </div>
          ) : servicos.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Nenhum serviço registrado</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {servicos.map((servico) => {
                const isExpanded = expandidos.has(servico.id)

                return (
                  <Card key={servico.id} className="space-y-2">
                    <button
                      onClick={() => toggleExpandido(servico.id)}
                      className="w-full flex items-start justify-between gap-3 pb-3 border-b border-border hover:bg-secondary transition-colors rounded px-1"
                    >
                      <div className="flex-1 text-left min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono text-muted-foreground">
                            OS #{servico.numero_os || servico.id.slice(0, 6)}
                          </span>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                            {formatarTipoServico(servico.tipo)}
                          </span>
                        </div>
                        <p className="text-sm font-medium mt-1">
                          {servico.responsavel}
                        </p>
                      </div>
                      <div className="text-right text-sm text-muted-foreground flex-shrink-0">
                        <p>
                          {formatarData(servico.created_at)}
                        </p>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {isExpanded && (
                      <div className="space-y-3 pt-3">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-muted-foreground">Positivo</p>
                            <p className="font-mono">{servico.positivo}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Negativo</p>
                            <p className="font-mono">{servico.negativo}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Pós-chave</p>
                            <p className="font-mono">{servico.pos_chave}</p>
                          </div>
                          {servico.imei && (
                            <div>
                              <p className="text-muted-foreground">IMEI</p>
                              <p className="font-mono">{servico.imei}</p>
                            </div>
                          )}
                          {servico.imei_antigo && (
                            <div>
                              <p className="text-muted-foreground">IMEI Antigo</p>
                              <p className="font-mono text-xs">{servico.imei_antigo}</p>
                            </div>
                          )}
                          {servico.imei_novo && (
                            <div>
                              <p className="text-muted-foreground">IMEI Novo</p>
                              <p className="font-mono text-xs">{servico.imei_novo}</p>
                            </div>
                          )}
                        </div>

                        {(servico.anti_furto ||
                          servico.cor_corte ||
                          servico.local_instalacao) && (
                          <div className="space-y-2 border-t border-border pt-3">
                            <p className="text-xs font-semibold text-muted-foreground">
                              ANTI-FURTO
                            </p>
                            <div className="text-sm space-y-1">
                              {servico.anti_furto && (
                                <p>
                                  <span className="text-muted-foreground">Status:</span> {servico.anti_furto}
                                </p>
                              )}
                              {servico.cor_corte && (
                                <p>
                                  <span className="text-muted-foreground">Cor do corte:</span>{' '}
                                  {servico.cor_corte}
                                </p>
                              )}
                              {servico.local_instalacao && (
                                <p>
                                  <span className="text-muted-foreground">Local:</span>{' '}
                                  {servico.local_instalacao}
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {servico.observacoes && (
                          <div className="border-t border-border pt-3">
                            <p className="text-xs font-semibold text-muted-foreground mb-1">
                              OBSERVAÇÕES
                            </p>
                            <p className="text-sm text-card-foreground">
                              {servico.observacoes}
                            </p>
                          </div>
                        )}

                        <button
                          onClick={() => handleAbrirServico(servico)}
                          className="w-full text-sm text-primary hover:text-primary/80 font-medium transition-colors pt-2 border-t border-border"
                        >
                          Ver detalhes completos
                        </button>
                      </div>
                    )}
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </main>

      <ConfirmDialog
        open={mostrarConfirm}
        titulo="Abrir serviço"
        mensagem="Deseja abrir este serviço?"
        textoBotaoPrimario="Ver detalhes"
        textoBotaoSecundario="Cancelar"
        onPrimario={() => {
          onAbrirServico?.(servicoSelecionado!)
          setMostrarConfirm(false)
        }}
        onSecundario={() => setMostrarConfirm(false)}
      />
    </>
  )
}
