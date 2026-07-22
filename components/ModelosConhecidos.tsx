'use client'

import { useState } from 'react'
import { BookOpen, ChevronDown, Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Header from './Header'
import Card from './Card'
import { ModeloConhecido } from '@/lib/types'
import { useModelosConhecidos } from '@/hooks/useModelos'

interface ModelosConhecidosProps {
  onVoltar?: () => void
  onEditar?: (modelo: ModeloConhecido) => void
}

export default function ModelosConhecidos({
  onVoltar,
  onEditar,
}: ModelosConhecidosProps) {
  const { data: modelos = [], isLoading, error } = useModelosConhecidos()
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

  return (
    <>
      <Header onVoltar={onVoltar} />

      <main className="pb-20 md:pb-8">
        <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-6">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <h1 className="text-lg font-semibold">Modelos Conhecidos</h1>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-secondary rounded-lg animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <Card className="p-8 text-center space-y-3">
              <p className="text-destructive font-medium">Não foi possível carregar os modelos</p>
              <p className="text-xs text-muted-foreground">
                Verifique se Supabase está configurado com as variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.
              </p>
            </Card>
          ) : modelos.length === 0 ? (
            <Card className="p-8 text-center space-y-3">
              <div>
                <p className="text-muted-foreground font-medium">
                  Nenhum modelo registrado ainda
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Os modelos de veículos aparecem aqui automaticamente conforme você registra serviços de instalação.
                </p>
              </div>
              <div className="text-xs text-muted-foreground border-t border-border pt-3">
                <p>Quando você registrar um serviço em um novo modelo de veículo, as configurações (posição das ligações, cor do fio de corte, etc.) serão armazenadas aqui para referência futura.</p>
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              {modelos.map((modelo) => {
                const isExpanded = expandidos.has(modelo.id)

                return (
                  <Card key={modelo.id} className="space-y-2">
                    <button
                      onClick={() => toggleExpandido(modelo.id)}
                      className="w-full flex items-start justify-between gap-3 pb-3 border-b border-border hover:bg-secondary transition-colors rounded px-1"
                    >
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-sm font-semibold text-card-foreground truncate">
                          {modelo.marca} {modelo.modelo}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {modelo.quantidadeUtilizada}{' '}
                          {modelo.quantidadeUtilizada === 1
                            ? 'instalação'
                            : 'instalações'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {modelo.ehPadrao && (
                          <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-100 px-2 py-1 rounded">
                            Padrão
                          </span>
                        )}
                        <ChevronDown
                          className={`w-4 h-4 text-muted-foreground transition-transform ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="space-y-3 pt-3">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          {modelo.positivo && (
                            <div>
                              <p className="text-muted-foreground">Positivo</p>
                              <p className="font-mono">{modelo.positivo}</p>
                            </div>
                          )}
                          {modelo.negativo && (
                            <div>
                              <p className="text-muted-foreground">Negativo</p>
                              <p className="font-mono">{modelo.negativo}</p>
                            </div>
                          )}
                          {modelo.posChave && (
                            <div>
                              <p className="text-muted-foreground">Pós-chave</p>
                              <p className="font-mono">{modelo.posChave}</p>
                            </div>
                          )}
                          {modelo.corCorte && (
                            <div>
                              <p className="text-muted-foreground">Cor do Corte</p>
                              <p>{modelo.corCorte}</p>
                            </div>
                          )}
                        </div>

                        {modelo.localInstalacao && (
                          <div className="border-t border-border pt-3">
                            <p className="text-muted-foreground text-xs">
                              Local de Instalação
                            </p>
                            <p className="text-sm">{modelo.localInstalacao}</p>
                          </div>
                        )}

                        <div className="border-t border-border pt-3">
                          <p className="text-muted-foreground text-xs mb-2">
                            Última utilização
                          </p>
                          <p className="text-sm">
                            {new Date(modelo.ultimaUtilizacao).toLocaleDateString(
                              'pt-BR'
                            )}{' '}
                            às{' '}
                            {new Date(modelo.ultimaUtilizacao).toLocaleTimeString(
                              'pt-BR',
                              {
                                hour: '2-digit',
                                minute: '2-digit',
                              }
                            )}
                          </p>
                        </div>

                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full gap-2"
                          onClick={() => onEditar?.(modelo)}
                        >
                          <Edit2 className="w-4 h-4" />
                          Editar Configuração
                        </Button>
                      </div>
                    )}
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
