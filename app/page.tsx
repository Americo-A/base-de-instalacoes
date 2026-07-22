"use client"

import { useEffect, useState } from "react"
import PageContainer from "@/components/layout/PageContainer"
import { buscarModelos } from "@/lib/services/modelos"

import AppHeader from "@/components/layout/AppHeader"
import SearchInput from "@/components/ui/SearchInput"
import LoadingSkeleton from "@/components/ui/LoadingSkeleton"
import EmptyState from "@/components/ui/EmptyState"
import Link from "next/link"
import { Plus } from "lucide-react"

import VehicleModelCard from "@/components/modelo/VehicleModelCard"
 interface ModeloConhecido {
  id: string
  marca: string
  modelo: string
  ano: string

  quantidade_utilizada: number

  total_configuracoes: number
}

export default function Home() {

  const [modelos, setModelos] = useState<ModeloConhecido[]>([])
  const [busca, setBusca] = useState("")
  const [loading, setLoading] = useState(true)


  async function carregarModelos() {

    setLoading(true)

    try {

      const data = await buscarModelos(busca)

      setModelos(data || [])

    } finally {

      setLoading(false)

    }

  }


  useEffect(() => {

    carregarModelos()

  }, [busca])


  return (

    <PageContainer>
<AppHeader
  title=""
  subtitle="Base de instalações"
  align="center"
  showMenu
/>

      <SearchInput
        value={busca}
        onChange={setBusca}
        placeholder="Pesquisar veículo..."
      />


      <section className="mt-6">


        {loading && <LoadingSkeleton />}



        {!loading && modelos.length === 0 && (

          <EmptyState
            title="Nenhum veículo encontrado"
            description="Tente pesquisar outro modelo ou registre uma nova instalação."
          />

        )}



        {!loading && modelos.length > 0 && (

          <div
            className="
              flex
              flex-col
              gap-3
            "
          >

            {modelos.map((modelo) => (

              <VehicleModelCard
                key={modelo.id}
                modelo={modelo}
              />

            ))}

          </div>

        )}


      </section>



    <Link
  href="/nova-instalacao"
  className="
    fixed
    bottom-8
    left-1/2
    -translate-x-1/2
    z-50
    bg-[#16A34A]
    text-white
    px-5
    py-3
    rounded-full
    shadow-lg
    text-sm
    font-semibold
    transition
    flex
    items-center
    gap-2
    whitespace-nowrap
  "
>
  <Plus size={18} />
  Nova Instalação
</Link>

    </PageContainer>

  )

}