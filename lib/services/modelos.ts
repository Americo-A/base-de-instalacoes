import { supabase } from "@/lib/supabase"



export async function buscarModelos(busca: string = "") {
  let query = supabase
    .from("modelos_conhecidos")
    .select(`
      id,
      marca,
      modelo,
      ano,
      configuracoes_modelo(
        id,
        quantidade_utilizada
      )
    `)

  if (busca.trim()) {
    query = query.or(
      `marca.ilike.%${busca}%,modelo.ilike.%${busca}%,ano.ilike.%${busca}%`
    )
  }

  const { data, error } = await query

  if (error) throw error

  return (data ?? [])
    .map((modelo: any) => ({
      id: modelo.id,
      marca: modelo.marca,
      modelo: modelo.modelo,
      ano: modelo.ano,

      quantidade_utilizada:
        (modelo.configuracoes_modelo ?? []).reduce(
          (total: number, cfg: any) =>
            total + (cfg.quantidade_utilizada || 0),
          0
        ),

      total_configuracoes:
        (modelo.configuracoes_modelo ?? []).length,
    }))
    .sort(
      (a, b) =>
        b.quantidade_utilizada - a.quantidade_utilizada
    )
}

export async function buscarModelo(id: string) {
  const { data, error } = await supabase
    .from("modelos_conhecidos")
    .select("*")
    .eq("id", id)
    .single()

  if (error) throw error

  return data
}
