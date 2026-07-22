import { z } from 'zod'

export const VeiculoSchema = z.object({
  cliente: z.string().min(1, 'Cliente é obrigatório'),
  telefone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  endereco: z.string().optional().default(''),
  placa: z.string().min(1, 'Placa é obrigatória'),
  marca: z.string().min(1, 'Marca é obrigatória'),
  modelo: z.string().min(1, 'Modelo é obrigatório'),
  ano: z.coerce.number().min(1900).max(new Date().getFullYear() + 1),
  chassi: z.string().optional().default(''),
})

export type VeiculoFormData = z.infer<typeof VeiculoSchema>

export const ServicoSchema = z.object({
  veiculo_id: z.string().min(1, 'Veículo é obrigatório'),
  tipo: z.enum(['instalacao', 'instalacao_com_bloqueio', 'manutencao', 'remocao']),
  data: z.string().min(1, 'Data é obrigatória'),
  responsavel: z.string().min(1, 'Responsável é obrigatório'),
  positivo: z.string().min(1, 'Positivo é obrigatório'),
  negativo: z.string().min(1, 'Negativo é obrigatório'),
  pos_chave: z.string().min(1, 'Pós-chave é obrigatório'),
  imei: z.string().optional().default(''),
  imei_antigo: z.string().optional().default(''),
  imei_novo: z.string().optional().default(''),
  anti_furto: z.string().optional().default(''),
  cor_corte: z.string().optional().default(''),
  local_instalacao: z.string().optional().default(''),
  observacoes: z.string().optional().default(''),
})

export type ServicoFormData = z.infer<typeof ServicoSchema>

// Cadastro simples de uma configuração de modelo (sem placa/cliente/chassi)
export const ConfiguracaoSchema = z.object({
  marca: z.string().min(1, 'Marca é obrigatória'),
  modelo: z.string().min(1, 'Modelo é obrigatório'),
  ano: z.string().min(1, 'Ano é obrigatório'),
  positivo: z.string().min(1, 'Positivo é obrigatório'),
  negativo: z.string().min(1, 'Negativo é obrigatório'),
  pos_chave: z.string().min(1, 'Pós-chave é obrigatório'),
  anti_furto: z.string().optional().default(''),
  cor_corte: z.string().optional().default(''),
  local_instalacao: z.string().optional().default(''),
  observacoes: z.string().optional().default(''),
})

export type ConfiguracaoFormData = z.infer<typeof ConfiguracaoSchema>

// Novo serviço no fluxo reorganizado: primeiro os dados técnicos,
// depois os dados administrativos (o veículo é criado ao salvar).
export const ServicoCompletoSchema = z.object({
  tipo: z.enum(['instalacao', 'instalacao_com_bloqueio', 'manutencao', 'remocao']),
  data: z.string().min(1, 'Data é obrigatória'),
  responsavel: z.string().min(1, 'Responsável é obrigatório'),
  positivo: z.string().min(1, 'Positivo é obrigatório'),
  negativo: z.string().min(1, 'Negativo é obrigatório'),
  pos_chave: z.string().min(1, 'Pós-chave é obrigatório'),
  imei: z.string().optional().default(''),
  imei_antigo: z.string().optional().default(''),
  imei_novo: z.string().optional().default(''),
  anti_furto: z.string().optional().default(''),
  cor_corte: z.string().optional().default(''),
  local_instalacao: z.string().optional().default(''),
  observacoes: z.string().optional().default(''),
  // Dados administrativos
  cliente: z.string().min(1, 'Cliente é obrigatório'),
  telefone: z.string().optional().default(''),
  endereco: z.string().optional().default(''),
  placa: z.string().min(1, 'Placa é obrigatória'),
  marca: z.string().min(1, 'Marca é obrigatória'),
  modelo: z.string().min(1, 'Modelo é obrigatório'),
  ano: z.string().min(1, 'Ano é obrigatório'),
  chassi: z.string().optional().default(''),
})

export type ServicoCompletoFormData = z.infer<typeof ServicoCompletoSchema>
