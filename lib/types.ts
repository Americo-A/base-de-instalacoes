export type TipoServico = 'instalacao' | 'instalacao_com_bloqueio' | 'manutencao' | 'remocao'

export interface Veiculo {
  id: string
  cliente: string
  telefone: string
  endereco: string
  placa: string
  marca: string
  modelo: string
  ano: string
  chassi: string
  created_at?: string
  updated_at?: string
}

export interface Servico {
  id: string
  veiculo_id: string
  data_servico: string
  tipo_servico: TipoServico
  responsavel: string
  positivo: string
  negativo: string
  pos_chave: string
  imei?: string
  imei_antigo?: string
  imei_novo?: string
  anti_furto?: boolean
  cor_corte?: string
  local_instalacao?: string
  observacoes?: string
  numero_os?: number
  created_at?: string
  updated_at?: string
}

export interface ModeloConhecido {
  id: string
  marca: string
  modelo: string
  ano: string
  quantidade_utilizada?: number
  ultima_utilizacao?: string
  created_at?: string
  updated_at?: string
}

export interface ConfiguracaoModelo {
  id: string
  modelo_id: string
  positivo: string
  negativo: string
  pos_chave: string
  anti_furto?: boolean
  cor_corte?: string
  local_instalacao?: string
  observacoes?: string
  quantidade_utilizada: number
  favorita?: boolean
  ultima_utilizacao: string
  created_at?: string
  updated_at?: string
}

export interface ModeloComConfiguracoes extends ModeloConhecido {
  configuracoes: ConfiguracaoModelo[]
  total_instalacoes: number
}

export interface VeiculoComServicos extends Veiculo {
  servicos?: Servico[]
  total_servicos?: number
}

export interface ServicoComVeiculo extends Servico {
  veiculo?: Veiculo
}

export interface DashboardStats {
  total_veiculos: number
  total_servicos: number
  servicos_mes_atual: number
  servicos_mes_anterior: number
  por_tipo: Record<TipoServico, number>
  por_tipo_mes_anterior?: Record<TipoServico, number>
}
