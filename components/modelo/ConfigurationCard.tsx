"use client"

import Card from "@/components/ui/Card"
import PrimaryButton from "@/components/ui/PrimaryButton"
import SecondaryButton from "@/components/ui/SecondaryButton"

import {
  Star,
  Zap,
  Power,
  KeyRound,
  MapPin,
  RotateCw,
  Trash2,
} from "lucide-react"

interface Props {
  id: string

  favorita: boolean

  positivo: string
  negativo: string
  pos_chave: string

  local_instalacao?: string
  observacoes?: string

  quantidade_utilizada: number

  onUse?: (id: string) => void
  onHistory?: () => void
  onDelete?: (id: string) => void
  
}

export default function ConfigurationCard({
  id,
  favorita,
  positivo,
  negativo,
  pos_chave,
  local_instalacao,
  observacoes,
  quantidade_utilizada,
  onUse,
  onHistory,
  onDelete,
}: Props) {
  return (
    <Card className="space-y-5">

      {favorita && (
        <div
          className="
            inline-flex
            items-center
            gap-2
            rounded-full
            bg-yellow-100
            px-3
            py-1
          "
        >
          <Star
            size={16}
            className="text-yellow-600"
            fill="currentColor"
          />

          <span
            className="
              text-xs
              font-semibold
              text-yellow-700
            "
          >
            FAVORITA
          </span>
        </div>
      )}

      <InfoRow
        icon={<Zap size={18} />}
        title="Positivo"
        value={positivo}
      />

      <InfoRow
        icon={<Power size={18} />}
        title="Negativo"
        value={negativo}
      />

      <InfoRow
        icon={<KeyRound size={18} />}
        title="Pós-chave"
        value={pos_chave}
      />

      {local_instalacao && (
        <InfoRow
          icon={<MapPin size={18} />}
          title="Local"
          value={local_instalacao}
        />
      )}

      {observacoes && (
        <div>
          <p className="text-sm font-medium text-gray-900">
            Observações
          </p>

          <p className="text-sm text-gray-700">
            {observacoes}
          </p>
        </div>
      )}

      <div className="flex items-center gap-2 text-sm text-gray-500">
        <RotateCw size={16} />
        {quantidade_utilizada} utilizações
      </div>

      <PrimaryButton
        onClick={() => onUse?.(id)}
      >
        Usar esta configuração
      </PrimaryButton>

      <SecondaryButton onClick={onHistory}>
        Ver histórico
      </SecondaryButton>

      <button
        onClick={() => onDelete?.(id)}
        className="
          w-full
          flex
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-red-600
          hover:bg-red-700
          text-white
          py-3
          font-semibold
          transition
          active:scale-95
        "
      >
        <Trash2 size={18} />
        Excluir instalação
      </button>

      

     

    </Card>
  )
}

interface InfoRowProps {
  icon: React.ReactNode
  title: string
  value: string
}

function InfoRow({
  icon,
  title,
  value,
}: InfoRowProps) {
  return (
    <div className="flex gap-3">

      <div className="mt-0.5 text-gray-500">
        {icon}
      </div>

      <div>

        <p className="text-xs font-semibold uppercase text-gray-700">
          {title}
        </p>

        <p className="font-semibold text-gray-900">
          {value}
        </p>

      </div>

    </div>
  )
}