"use client"

import { Trash2 } from "lucide-react"

interface VehicleInfoProps {
  marca: string
  modelo: string
  ano: string
  totalConfiguracoes: number
  onDelete?: () => void
}

export default function VehicleInfo({
  marca,
  modelo,
  ano,
  totalConfiguracoes,
  onDelete,
}: VehicleInfoProps) {
  return (
    <section className="mb-8">

      <div className="flex items-start justify-between">

        <div>

          <h1
            className="
              text-3xl
              font-bold
              tracking-tight
              text-gray-900
            "
          >
            {marca} {modelo}
          </h1>

          <p
            className="
              mt-2
              text-base
              text-gray-500
            "
          >
            Ano {ano}
          </p>

        </div>

        <button
          onClick={onDelete}
          className="
            flex
            items-center
            justify-center
            w-10
            h-10
            rounded-xl
            bg-red-50
            text-red-600
            hover:bg-red-100
            transition
          "
          title="Excluir veículo"
        >
          <Trash2 size={18} />
        </button>

      </div>

      <div
        className="
          mt-5
          inline-flex
          items-center
          rounded-full
          bg-gray-100
          px-4
          py-2
        "
      >
        <span
          className="
            text-sm
            font-medium
            text-gray-700
          "
        >
          {totalConfiguracoes} configurações conhecidas
        </span>
      </div>

    </section>
  )
}