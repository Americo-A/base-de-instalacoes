import { supabase } from "@/lib/supabase"


interface InstalacaoForm {

  tipo_servico: string
  responsavel: string

  cliente: string
  telefone: string
  endereco: string

  marca: string
  modelo: string
  ano: string
  placa: string
  chassi: string

  imei: string
  imei_antigo: string
  imei_novo: string

  positivo: string
  negativo: string
  pos_chave: string

  anti_furto: boolean

  cor_corte: string

  local_instalacao: string
  observacoes: string

}



export async function criarInstalacao(
  dados: InstalacaoForm
) {


  /*
  1 - Buscar ou criar modelo conhecido
  */


  let modeloId: string



  const {
    data: modeloExistente,
    error: modeloErro
  } = await supabase

    .from("modelos_conhecidos")

    .select("id")

    .eq("marca", dados.marca)

    .eq("modelo", dados.modelo)

    .eq("ano", dados.ano)

    .maybeSingle()



  if(modeloErro)
    throw modeloErro




  if(modeloExistente){

    modeloId = modeloExistente.id

  }

  else {


    const {
      data: novoModelo,
      error
    } = await supabase

      .from("modelos_conhecidos")

      .insert({

        marca:dados.marca,

        modelo:dados.modelo,

        ano:dados.ano

      })

      .select()

      .single()



    if(error)
      throw error



    modeloId = novoModelo.id

  }




/*
2 - Buscar ou criar configuração
*/


const {data:configExistente,error:erroBuscaConfig}=

await supabase

.from("configuracoes_modelo")

.select("*")

.eq("modelo_id", modeloId)

.eq("positivo", dados.positivo || null)

.eq("negativo", dados.negativo || null)

.eq("pos_chave", dados.pos_chave || null)

.eq("local_instalacao", dados.local_instalacao || null)

.maybeSingle()



if(erroBuscaConfig)
throw erroBuscaConfig



let configuracao



if(configExistente){


  const {data:configAtualizada,error}=

  await supabase

  .from("configuracoes_modelo")

  .update({

    quantidade_utilizada:
    (configExistente.quantidade_utilizada || 0) + 1,

    ultima_utilizacao:
    new Date().toISOString()

  })

  .eq("id",configExistente.id)

  .select()

  .single()



  if(error)
  throw error



  configuracao = configAtualizada



}


else{


  const {data:novaConfiguracao,error}=

  await supabase

  .from("configuracoes_modelo")

  .insert({


    modelo_id:modeloId,


    positivo:dados.positivo || null,

    negativo:dados.negativo || null,

    pos_chave:dados.pos_chave || null,


    anti_furto:dados.anti_furto,


    cor_corte:dados.cor_corte || null,


    local_instalacao:
    dados.local_instalacao || null,


    observacoes:
    dados.observacoes || null,


    favorita:false,


    quantidade_utilizada:1,


    ultima_utilizacao:
    new Date().toISOString()


  })

  .select()

  .single()



  if(error)
  throw error



  configuracao = novaConfiguracao


}





  /*
  3 - Se não tiver veículo,
  retorna apenas configuração
  */


  const possuiVeiculo =

    dados.cliente ||
    dados.placa ||
    dados.chassi






  /*
  4 - Criar veículo
  */

let veiculo = null


if(possuiVeiculo){


const {
 data,
 error:erroVeiculo
} = await supabase

.from("veiculos")

.insert({

cliente:dados.cliente || null,

telefone:dados.telefone || null,

endereco:dados.endereco || null,

placa:dados.placa || null,

marca:dados.marca || null,

modelo:dados.modelo || null,

ano:dados.ano || null,

chassi:dados.chassi || null

})

.select()

.single()


if(erroVeiculo)
throw erroVeiculo


veiculo = data

}


/*
5 - Criar serviço somente se existir veículo
*/

let servico = null


if(veiculo){


const {
 data,
 error:erroServico
} = await supabase


.from("servicos")


.insert({


veiculo_id: veiculo.id,


configuracao_id: configuracao.id,


tipo_servico:
dados.tipo_servico || null,


responsavel:
dados.responsavel || null,


positivo:
dados.positivo || null,


negativo:
dados.negativo || null,


pos_chave:
dados.pos_chave || null,


imei:
dados.imei || null,


imei_antigo:
dados.imei_antigo || null,


imei_novo:
dados.imei_novo || null,


anti_furto:
dados.anti_furto,


cor_corte:
dados.cor_corte || null,


local_instalacao:
dados.local_instalacao || null,


observacoes:
dados.observacoes || null


})


.select()


.single()



if(erroServico)
throw erroServico



servico = data


}
return {
  modeloId,
  configuracao,
  veiculo,
  servico,
}

}
export async function excluirInstalacao(
  configuracaoId: string
) {


  /*
  1 - Excluir serviços vinculados
  */

  const { error: erroServicos } = await supabase
    .from("servicos")
    .delete()
    .eq(
      "configuracao_id",
      configuracaoId
    )


  if(erroServicos)
    throw erroServicos



  /*
  2 - Excluir configuração dos fios
  */

  const { error: erroConfiguracao } = await supabase
    .from("configuracoes_modelo")
    .delete()
    .eq(
      "id",
      configuracaoId
    )


  if(erroConfiguracao)
    throw erroConfiguracao



  return true
}

 export async function excluirInstalacaoCompleta(
  modeloId: string
) {

  // procura todas as configurações do modelo
  const { data: configuracoes, error } = await supabase
    .from("configuracoes_modelo")
    .select("id")
    .eq("modelo_id", modeloId)

  if (error) throw error

  const idsConfiguracoes =
    configuracoes?.map(c => c.id) || []

  if (idsConfiguracoes.length > 0) {

    // procura todos os serviços
    const { data: servicos } = await supabase
      .from("servicos")
      .select("id, veiculo_id")
      .in("configuracao_id", idsConfiguracoes)

    // apaga serviços
    await supabase
      .from("servicos")
      .delete()
      .in("configuracao_id", idsConfiguracoes)

    // apaga veículos
    const idsVeiculos =
      servicos
        ?.map(s => s.veiculo_id)
        .filter(Boolean) || []

    if (idsVeiculos.length > 0) {

      await supabase
        .from("veiculos")
        .delete()
        .in("id", idsVeiculos)

    }

    // apaga configurações
    await supabase
      .from("configuracoes_modelo")
      .delete()
      .in("id", idsConfiguracoes)

  }

  // por último apaga o modelo
  const { error: erroModelo } = await supabase
    .from("modelos_conhecidos")
    .delete()
    .eq("id", modeloId)

  if (erroModelo)
    throw erroModelo

  return true
}