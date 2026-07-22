# Guia de Migração: Mock Data → Supabase

Este documento descreve como migrar de dados mock (localStorage) para Supabase real.

## Status Atual

- ✅ Frontend: Totalmente preparado com React Query + Hooks
- ✅ Validações: Implementadas com Zod
- ✅ Tipos: Todos definidos corretamente
- ✅ Services: Prontos para Supabase
- ⏳ Backend: Aguardando credenciais do Supabase

## Passo 1: Preparar Supabase

Veja [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) para criar o banco de dados com todas as tabelas.

## Passo 2: Configurar Variáveis de Ambiente

Crie `.env.local` com:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-aqui
```

## Passo 3: Testar Conexão

1. Inicie o servidor: `pnpm dev`
2. Abra o DevTools > Console
3. Tente criar um novo veículo
4. Verifique no Supabase Dashboard se os dados foram salvos

## Estrutura de Dados

### Veículos

```typescript
{
  id: UUID,
  cliente: string,        // Nome do cliente
  telefone: string,       // Apenas números
  endereco: string,       // Endereço completo
  placa: string,          // ABC1234
  marca: string,          // Toyota
  modelo: string,         // Corolla
  ano: number,            // 2024
  chassi: string,         // VIN
  created_at: timestamp,
  updated_at: timestamp
}
```

### Serviços

```typescript
{
  id: UUID,
  numero_os: bigint,      // Auto-incrementado por trigger
  veiculo_id: UUID,       // FK → veiculos
  data: date,             // Data do serviço
  tipo: 'instalacao' | 'instalacao_com_bloqueio' | 'manutencao' | 'remocao',
  responsavel: string,    // Nome do técnico
  positivo: string,       // Ex: "Vermelho"
  negativo: string,       // Ex: "Preto"
  pos_chave: string,      // Ex: "Amarelo"
  imei: string,           // Opcional
  imei_antigo: string,    // Opcional
  imei_novo: string,      // Opcional
  anti_furto: string,     // Ex: "Sim/Não"
  cor_corte: string,      // Ex: "Verde"
  local_instalacao: string,
  observacoes: string,
  created_at: timestamp,
  updated_at: timestamp
}
```

### Modelos Conhecidos

```typescript
{
  id: UUID,
  marca: string,          // Toyota
  modelo: string,         // Corolla (unique com marca)
  created_at: timestamp,
  updated_at: timestamp
}
```

### Configurações do Modelo

```typescript
{
  id: UUID,
  modelo_id: UUID,        // FK → modelos_conhecidos
  positivo: string,       // Configuração mais usada
  negativo: string,
  pos_chave: string,
  imei: string,
  anti_furto: string,
  cor_corte: string,
  local_instalacao: string,
  quantidade_utilizada: integer,
  ultima_utilizacao: timestamp,
  created_at: timestamp,
  updated_at: timestamp
}
```

## Hooks Disponíveis

### Veículos

```typescript
const { data: veiculos, isLoading, error } = useVeiculos()
const { data: veiculo } = useVeiculo(id)
const searchResult = useSearchVeiculos(query)
const createMutation = useCreateVeiculo()
const updateMutation = useUpdateVeiculo()
const deleteMutation = useDeleteVeiculo()

// Usar:
createMutation.mutateAsync({ cliente: 'João', ... })
```

### Serviços

```typescript
const { data: servicos } = useServicos(veiculoId)
const { data: ultimos } = useUltimosServicos(30)
const { data: servico } = useServico(id)
const searchResult = useSearchServicos(query, { tipo, dataDe, dataAte })
const createMutation = useCreateServico()
```

### Modelos

```typescript
const { data: modelos } = useModelosConhecidos()
const { data: modelo } = useModeloConhecido(marca, modelo)
const { data: configuracoes } = useConfiguracoesPorModelo(modeloId)
```

### Dashboard

```typescript
const { data: stats } = useDashboardStats()
// {
//   total_veiculos: number,
//   total_servicos: number,
//   servicos_mes_atual: number,
//   servicos_mes_anterior: number,
//   por_tipo: { instalacao, instalacao_com_bloqueio, manutencao, remocao }
//   por_tipo_mes_anterior: { ... }
// }
```

## Cache Invalidation

React Query invalida automaticamente o cache quando dados mudam:

```typescript
// Ao criar veículo:
queryClient.invalidateQueries({ queryKey: ['veiculos'] })

// Ao criar serviço:
queryClient.invalidateQueries({ queryKey: ['servicos'] })
queryClient.invalidateQueries({ queryKey: ['dashboard'] })
```

## Tratamento de Erros

Todos os services lançam erros que devem ser capturados:

```typescript
try {
  await createVeiculo.mutateAsync(data)
} catch (error) {
  toast.erro(
    error instanceof Error ? error.message : 'Erro ao salvar'
  )
}
```

## Validações Zod

```typescript
// Validação de Veículo
const schema = VeiculoSchema
const resultado = schema.parse(data)  // Lança erro se inválido
const resultado = schema.safeParse(data)  // Retorna { success, data/error }

// Validação de Serviço
const schema = ServicoSchema
```

## Triggers Automáticas Necessárias

### 1. Gerar numero_os

```sql
CREATE OR REPLACE FUNCTION generate_numero_os()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.numero_os IS NULL THEN
    SELECT COALESCE(MAX(numero_os), 0) + 1 INTO NEW.numero_os FROM servicos;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_generate_numero_os
BEFORE INSERT ON servicos
FOR EACH ROW
EXECUTE FUNCTION generate_numero_os();
```

### 2. Atualizar configuracoes_modelo

O banco deve ter uma trigger que:
1. Quando um serviço é criado
2. Busca o modelo do veículo
3. Incrementa `quantidade_utilizada`
4. Atualiza `ultima_utilizacao`

## Performance

### Query Optimization

- Índices criados em `placa`, `cliente`, `data`, `tipo`
- Limite de 30 na busca de "últimos serviços"
- Stale time de 5 minutos para dados estáticos

### Caching

```typescript
// React Query configurado com:
// - staleTime: 5 minutos
// - gcTime: 10 minutos
// - retry: 1 vez
// - refetchOnWindowFocus: false
```

## Troubleshooting

### Erro: "Missing environment variables"
- [ ] Verifique `.env.local`
- [ ] Reinicie o servidor
- [ ] Limpe `.next/` se persistir

### Erro: "Could not resolve dependency"
- [ ] Execute: `pnpm install`
- [ ] Limpe node_modules: `rm -rf node_modules && pnpm install`

### Erro: "UNIQUE constraint violation"
- [ ] Placa já existe
- [ ] Use `placa.toUpperCase()` para normalizar

### Dados não aparecem
- [ ] Verifique RLS policies no Supabase
- [ ] Verifique permissões de SELECT
- [ ] Verifique se os dados realmente existem no banco

## Próximas Fases

### Fase 2: Autenticação
- [ ] Implementar Supabase Auth
- [ ] Suporte a múltiplos usuários
- [ ] RLS policies por usuário

### Fase 3: Melhorias
- [ ] Upload de fotos (Vercel Blob)
- [ ] Geração de PDF
- [ ] Relatórios avançados
- [ ] Integração com WhatsApp API

### Fase 4: Escalabilidade
- [ ] Edge Functions
- [ ] Database functions
- [ ] Real-time subscriptions
- [ ] Webhook para integrações externas
