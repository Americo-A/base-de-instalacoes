import { supabase } from "@/lib/supabase"

export async function buscarConfiguracoes(modeloId: string) {
  const { data, error } = await supabase
    .from("configuracoes_modelo")
    .select("*")
    .eq("modelo_id", modeloId)
    .order("favorita", { ascending: false })
    .order("quantidade_utilizada", { ascending: false })
    .order("ultima_utilizacao", { ascending: false })

  if (error) throw error

  return data
}
export async function criarConfiguracao(
  configuracao: {
    modelo_id: string

    positivo: string
    negativo: string
    pos_chave: string

    anti_furto: string
    cor_corte: string

    local_instalacao: string
    observacoes: string

    favorita: boolean
  }
) {
  const { data, error } = await supabase
    .from("configuracoes_modelo")
    .insert(configuracao)
    .select()
    .single()

  if (error) throw error

  return data
}
export async function buscarConfiguracaoPorId(
  id: string
) {

  const { data, error } = await supabase
    .from("configuracoes_modelo")
    .select("*")
    .eq("id", id)
    .single()


  if (error) {
    throw error
  }


  return data

}