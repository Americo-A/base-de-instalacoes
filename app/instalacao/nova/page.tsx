"use client"

import { useState } from "react"

import PageContainer from "@/components/layout/PageContainer"
import AppHeader from "@/components/layout/AppHeader"

import FormInput from "@/components/form/FormInput"
import FormTextarea from "@/components/form/FormTextarea"

import PrimaryButton from "@/components/ui/PrimaryButton"


export default function NovaInstalacaoPage() {

  const [marca, setMarca] = useState("")
  const [modelo, setModelo] = useState("")
  const [ano, setAno] = useState("")

  const [cliente, setCliente] = useState("")
  const [telefone, setTelefone] = useState("")
  const [endereco, setEndereco] = useState("")

  const [placa, setPlaca] = useState("")
  const [chassi, setChassi] = useState("")

  const [responsavel, setResponsavel] = useState("")
  const [tipoServico, setTipoServico] = useState("Instalação")

  const [positivo, setPositivo] = useState("")
  const [negativo, setNegativo] = useState("")
  const [posChave, setPosChave] = useState("")

  const [antiFurto, setAntiFurto] = useState("")
  const [corCorte, setCorCorte] = useState("")
  const [localInstalacao, setLocalInstalacao] = useState("")

  const [imei, setImei] = useState("")
  const [imeiAntigo, setImeiAntigo] = useState("")
  const [imeiNovo, setImeiNovo] = useState("")

  const [observacoes, setObservacoes] = useState("")


  async function salvar() {

    console.log({
      marca,
      modelo,
      ano,

      cliente,
      telefone,
      endereco,

      placa,
      chassi,

      responsavel,
      tipoServico,

      positivo,
      negativo,
      posChave,

      antiFurto,
      corCorte,
      localInstalacao,

      imei,
      imeiAntigo,
      imeiNovo,

      observacoes
    })

  }


  return (

    <PageContainer>

      <AppHeader
        title="Nova Instalação"
        subtitle="Registrar serviço"
        showBack
      />


      <div className="space-y-6">


        <section>

          <h2 className="text-lg font-semibold mb-4">
            Veículo
          </h2>


          <div className="space-y-4">

            <FormInput
              label="Marca"
              value={marca}
              onChange={setMarca}
            />

            <FormInput
              label="Modelo"
              value={modelo}
              onChange={setModelo}
            />

            <FormInput
              label="Ano"
              value={ano}
              onChange={setAno}
            />

            <FormInput
              label="Placa"
              value={placa}
              onChange={setPlaca}
            />

            <FormInput
              label="Chassi"
              value={chassi}
              onChange={setChassi}
            />

          </div>

        </section>



        <section>

          <h2 className="text-lg font-semibold mb-4">
            Configuração técnica
          </h2>


          <div className="space-y-4">

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
              value={localInstalacao}
              onChange={setLocalInstalacao}
            />


            <FormTextarea
              label="Observações"
              value={observacoes}
              onChange={setObservacoes}
            />

          </div>

        </section>



        <section>

          <h2 className="text-lg font-semibold mb-4">
            Dados do serviço
          </h2>


          <div className="space-y-4">


            <FormInput
              label="Cliente"
              value={cliente}
              onChange={setCliente}
            />


            <FormInput
              label="Telefone"
              value={telefone}
              onChange={setTelefone}
            />


            <FormInput
              label="Endereço"
              value={endereco}
              onChange={setEndereco}
            />


            <FormInput
              label="Responsável"
              value={responsavel}
              onChange={setResponsavel}
            />


            <FormInput
              label="IMEI"
              value={imei}
              onChange={setImei}
            />


            <FormInput
              label="IMEI antigo"
              value={imeiAntigo}
              onChange={setImeiAntigo}
            />


            <FormInput
              label="IMEI novo"
              value={imeiNovo}
              onChange={setImeiNovo}
            />

          </div>


        </section>



        <PrimaryButton
          onClick={salvar}
        >
          Salvar instalação
        </PrimaryButton>


      </div>


    </PageContainer>

  )
}