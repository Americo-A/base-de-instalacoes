import { supabase } from "@/lib/supabase"


export async function buscarHistoricoConfiguracao(
  configuracaoId:string
){

const {data,error}=await supabase
.from("servicos")
.select(`
  *,
  veiculos(
    cliente,
    telefone,
    placa,
    marca,
    modelo,
    ano
  )
`)
.eq(
  "configuracao_id",
  configuracaoId
)
.order(
  "created_at",
  {
    ascending:false
  }
)


if(error)
throw error


return data || []

}