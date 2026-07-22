"use client"

import { useState } from "react"

import FormInput from "@/components/form/FormInput"
import FormTextarea from "@/components/form/FormTextarea"
import PrimaryButton from "@/components/ui/PrimaryButton"

interface Props {
  onSubmit: (data: {
    positivo: string
    negativo: string
    pos_chave: string
    anti_furto: string
    cor_corte: string
    local_instalacao: string
    observacoes: string
    favorita: boolean
  }) => Promise<void>
}

export default function ConfigurationForm({
  onSubmit,
}: Props) {
  const [positivo, setPositivo] = useState("")
  const [negativo, setNegativo] = useState("")
  const [posChave, setPosChave] = useState("")
  const [antiFurto, setAntiFurto] = useState("")
  const [corCorte, setCorCorte] = useState("")
  const [local, setLocal] = useState("")
  const [observacoes, setObservacoes] = useState("")
  const [favorita, setFavorita] = useState(false)

  const [loading, setLoading] = useState(false)

  async function salvar() {
    setLoading(true)

    try {
      await onSubmit({
        positivo,
        negativo,
        pos_chave: posChave,
        anti_furto: antiFurto,
        cor_corte: corCorte,
        local_instalacao: local,
        observacoes,
        favorita,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5">

      <FormInput
        label="Positivo"
        value={positivo}
        onChange={setPositivo}
      />

      <FormInput
        label="Negativo"
        value={negativo}
        onChange={setNegativo}
      />

      <FormInput
        label="Pós-chave"
        value={posChave}
        onChange={setPosChave}
      />

      <FormInput
        label="Anti-furto"
        value={antiFurto}
        onChange={setAntiFurto}
      />

      <FormInput
        label="Cor do corte"
        value={corCorte}
        onChange={setCorCorte}
      />

      <FormInput
        label="Local da instalação"
        value={local}
        onChange={setLocal}
      />

      <FormTextarea
        label="Observações"
        value={observacoes}
        onChange={setObservacoes}
      />

      <label className="flex items-center gap-3">

        <input
          type="checkbox"
          checked={favorita}
          onChange={(e) => setFavorita(e.target.checked)}
        />

        <span>Marcar como favorita</span>

      </label>

      <PrimaryButton
        onClick={salvar}
        disabled={loading}
      >
        {loading ? "Salvando..." : "Salvar configuração"}
      </PrimaryButton>

    </div>
  )
}