"use client"
import { useRouter } from "next/navigation"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

import { buscarModelo } from "@/lib/services/modelos"
import { buscarConfiguracoes } from "@/lib/services/configuracoes"

import PageContainer from "@/components/layout/PageContainer"
import AppHeader from "@/components/layout/AppHeader"

import LoadingSkeleton from "@/components/ui/LoadingSkeleton"
import EmptyState from "@/components/ui/EmptyState"

import VehicleInfo from "@/components/modelo/VehicleInfo"
import ConfigurationCard from "@/components/modelo/ConfigurationCard"
import { excluirInstalacao } from "@/lib/services/instalacoes"

import { excluirInstalacaoCompleta } from "@/lib/services/instalacoes"

interface Modelo {
  id: string
  marca: string
  modelo: string
  ano: string
}


interface Configuracao {

  id: string

  favorita: boolean

  positivo: string
  negativo: string
  pos_chave: string

  anti_furto: string
  cor_corte: string

  local_instalacao: string
  observacoes: string

  quantidade_utilizada: number

}


export default function ModeloPage() {

const router = useRouter()

  const params = useParams()


  const [modelo, setModelo] = useState<Modelo | null>(null)

  const [configuracoes, setConfiguracoes] = useState<Configuracao[]>([])

  const [loading, setLoading] = useState(true)



  async function carregarDados() {

    setLoading(true)


    try {

      const modeloData =
        await buscarModelo(
          params.id as string
        )


      if(!modeloData){

        setModelo(null)
        return

      }


      setModelo(modeloData)



      const configuracoesData =
        await buscarConfiguracoes(
          modeloData.id
        )


      setConfiguracoes(
        configuracoesData || []
      )


    } catch(error){

      console.error(
        "Erro ao carregar modelo:",
        error
      )


      setModelo(null)


    } finally {

      setLoading(false)

    }

  }



  useEffect(() => {

    if(params.id){

      carregarDados()

    }

  },[params.id])



async function removerInstalacao(id: string) {

  const confirmar = window.confirm(
    "Deseja realmente excluir esta instalação?\n\nEssa ação não pode ser desfeita."
  )

  if (!confirmar) return

  try {

    await excluirInstalacao(id)

    setConfiguracoes((atual) =>
      atual.filter((item) => item.id !== id)
    )

    alert("Instalação excluída com sucesso")

  } catch (error) {

    console.error(error)

    alert("Erro ao excluir instalação")

  }

}
  return (

    <PageContainer>


     <AppHeader
  title=""
  subtitle="Detalhes do veículo"
  showBack
/>



      {loading && (

        <LoadingSkeleton />

      )}




      {!loading && !modelo && (

        <EmptyState

          title="Modelo não encontrado"

          description="Não foi possível localizar este veículo."

        />

      )}






      {!loading && modelo && (

        <div className="space-y-6">


          <VehicleInfo

            marca={modelo.marca}

            modelo={modelo.modelo}
             onDelete={excluirModeloCompleto}
            ano={modelo.ano}

            totalConfiguracoes={
              configuracoes.length
            }

          />
         

          <section className="space-y-4">


            {
              configuracoes.length === 0 && (

                <EmptyState

                  title="Nenhuma configuração cadastrada"

                  description="
                    Ainda não existe nenhuma instalação
                    registrada para este modelo.
                  "

                />

              )
            }





            {
              configuracoes.map(
                (configuracao)=>(


                  <ConfigurationCard
                  id={configuracao.id}

                    key={
                      configuracao.id
                    }


                    favorita={
                      configuracao.favorita
                    }


                    positivo={
                      configuracao.positivo
                    }


                    negativo={
                      configuracao.negativo
                    }


                    pos_chave={
                      configuracao.pos_chave
                    }


                    local_instalacao={
                      configuracao.local_instalacao
                    }


                    observacoes={
                      configuracao.observacoes
                    }


                    quantidade_utilizada={
                      configuracao.quantidade_utilizada
                    }



                   onUse={(id)=>{
                    router.push(`/nova-instalacao?config=${id}&modelo=${modelo.id}` )}}




                    onHistory={()=>{ router.push( `/historico/${configuracao.id}` ) }}

                    onDelete={removerInstalacao}


                  />


                )

              )
            }


          </section>



        </div>

      )}



    </PageContainer>

  )
  
  async function excluirModeloCompleto() {

  if (!modelo) return

  const confirmar = window.confirm(
    `Deseja excluir completamente o modelo ${modelo.marca} ${modelo.modelo}?\n\n` +
    "Serão removidos:\n\n" +
    "• todas as configurações\n" +
    "• todos os serviços\n" +
    "• todos os veículos cadastrados\n" +
    "• o próprio modelo\n\n" +
    "Essa ação não pode ser desfeita."
  )

  if (!confirmar) return

  try {

    await excluirInstalacaoCompleta(modelo.id)

    alert("Modelo excluído com sucesso.")

    router.push("/")

  } catch (error) {

    console.error(error)

    alert("Erro ao excluir modelo.")

  }

}}