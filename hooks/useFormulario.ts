import { useState, useCallback } from 'react'
import { ErroFormulario } from '@/lib/types'

interface ValidadorCampo {
  obrigatorio?: boolean
  minimo?: number
  maximo?: number
  pattern?: RegExp
  mensagem?: string
}

interface Validadores {
  [campo: string]: ValidadorCampo
}

export function useFormulario<T extends Record<string, any>>(
  valorInicial: T,
  validadores?: Validadores
) {
  const [valores, setValores] = useState<T>(valorInicial)
  const [erros, setErros] = useState<ErroFormulario>({})
  const [foiTocado, setFoiTocado] = useState<Record<string, boolean>>({})
  const [carregando, setCarregando] = useState(false)

  const validarCampo = useCallback(
    (campo: string, valor: any): string | null => {
      const validador = validadores?.[campo]
      if (!validador) return null

      if (validador.obrigatorio && (!valor || (typeof valor === 'string' && valor.trim() === ''))) {
        return validador.mensagem || 'Este campo é obrigatório'
      }

      if (validador.minimo && valor.toString().length < validador.minimo) {
        return validador.mensagem || `Mínimo de ${validador.minimo} caracteres`
      }

      if (validador.maximo && valor.toString().length > validador.maximo) {
        return validador.mensagem || `Máximo de ${validador.maximo} caracteres`
      }

      if (validador.pattern && !validador.pattern.test(valor)) {
        return validador.mensagem || 'Formato inválido'
      }

      return null
    },
    [validadores]
  )

  const handleMudanca = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, type } = e.target
      let valor: any = e.target.value

      if (type === 'checkbox') {
        valor = (e.target as HTMLInputElement).checked
      } else if (type === 'number') {
        valor = valor === '' ? '' : Number(valor)
      }

      setValores((prev) => ({
        ...prev,
        [name]: valor,
      }))

      // Validar apenas se o campo foi tocado
      if (foiTocado[name]) {
        const erro = validarCampo(name, valor)
        setErros((prev) => ({
          ...prev,
          [name]: erro || undefined,
        }))
      }
    },
    [foiTocado, validarCampo]
  )

  const handleBorrado = useCallback((campo: string) => {
    setFoiTocado((prev) => ({
      ...prev,
      [campo]: true,
    }))

    const valor = valores[campo]
    const erro = validarCampo(campo, valor)
    setErros((prev) => ({
      ...prev,
      [campo]: erro || undefined,
    }))
  }, [valores, validarCampo])

  const validarTudo = useCallback((): boolean => {
    const novosErros: ErroFormulario = {}

    if (validadores) {
      Object.keys(validadores).forEach((campo) => {
        const erro = validarCampo(campo, valores[campo])
        if (erro) {
          novosErros[campo] = erro
        }
      })
    }

    setErros(novosErros)
    setFoiTocado(
      Object.keys(validadores || {}).reduce(
        (acc, campo) => ({
          ...acc,
          [campo]: true,
        }),
        {}
      )
    )

    return Object.keys(novosErros).length === 0
  }, [valores, validadores, validarCampo])

  const resetar = useCallback(() => {
    setValores(valorInicial)
    setErros({})
    setFoiTocado({})
  }, [valorInicial])

  const atualizarValor = useCallback((campo: string, valor: any) => {
    setValores((prev) => ({
      ...prev,
      [campo]: valor,
    }))
  }, [])

  return {
    valores,
    erros,
    foiTocado,
    carregando,
    setCarregando,
    handleMudanca,
    handleBorrado,
    validarTudo,
    resetar,
    atualizarValor,
    setValores,
  }
}
