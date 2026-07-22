import { useState, useCallback } from 'react'

export function useNavegacao() {
  const [historico, setHistorico] = useState<string[]>([])
  const [telaAtual, setTelaAtual] = useState<string>('inicio')

  const irPara = useCallback((tela: string) => {
    setHistorico((prev) => [...prev, telaAtual])
    setTelaAtual(tela)
  }, [telaAtual])

  const voltar = useCallback(() => {
    if (historico.length > 0) {
      const novoHistorico = [...historico]
      const telaAnterior = novoHistorico.pop()
      setHistorico(novoHistorico)
      if (telaAnterior) {
        setTelaAtual(telaAnterior)
      }
    }
  }, [historico])

  const irParaInicio = useCallback(() => {
    setHistorico([])
    setTelaAtual('inicio')
  }, [])

  return {
    telaAtual,
    historico,
    irPara,
    voltar,
    irParaInicio,
  }
}
