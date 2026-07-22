"use client"

import Link from "next/link"
import { CarFront, ChevronRight } from "lucide-react"

import Card from "@/components/ui/Card"

interface ModeloConhecido {
  id: string
  marca: string
  modelo: string
  ano: string

  quantidade_utilizada: number
  total_configuracoes: number
}

interface VehicleModelCardProps {
  modelo: ModeloConhecido
}

export default function VehicleModelCard({
  modelo,
}: VehicleModelCardProps) {
  return (
    <Link
      href={`/modelo/${modelo.id}`}
      className="block"
    >
      <Card
        className="
          flex
          items-center
          justify-between
          hover:border-gray-300
          transition
        "
      >
        <div className="flex items-center gap-4">

          <div
            className="
              flex
              items-center
              justify-center
              w-14
              h-14
              rounded-2xl
              bg-gray-100
              flex-shrink-0
            "
          >
            <CarFront
              size={28}
              className="text-gray-700"
            />
          </div>

          <div>

            <h2
              className="
                text-base
                font-semibold
                text-gray-900
                leading-tight
              "
            >
              {modelo.marca} {modelo.modelo}
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-gray-500
              "
            >
              Ano {modelo.ano}
            </p>

            <div className="flex gap-2 mt-3 flex-wrap">

              <span
                className="
                  rounded-full
                  bg-blue-100
                  text-blue-700
                  text-xs
                  font-semibold
                  px-3
                  py-1
                "
              >
                {modelo.total_configuracoes} configurações
              </span>

              <span
                className="
                  rounded-full
                  bg-green-100
                  text-green-700
                  text-xs
                  font-semibold
                  px-3
                  py-1
                "
              >
                {modelo.quantidade_utilizada} utilizações
              </span>

            </div>

          </div>

        </div>

        <ChevronRight
          size={22}
          className="text-gray-400"
        />

      </Card>
    </Link>
  )
}