# Arquitetura - Controle de Instalações

## Visão Geral

A aplicação segue uma arquitetura moderna Next.js 16 com App Router, separação clara de responsabilidades e preparação para escalabilidade.

## Stack Tecnológico

- **Framework**: Next.js 16 (App Router)
- **Linguagem**: TypeScript 5.7
- **UI**: React 19 + Tailwind CSS 4 + shadcn/ui
- **Gerenciamento de Estado**: Hooks customizados + localStorage
- **Ícones**: Lucide React
- **Validação**: Validadores customizados em hooks
- **Backend**: Mock (preparado para Supabase)

## Estrutura de Pastas

### `/app`
Contém o layout raiz e página principal. O App Router do Next.js 16 permite roteamento file-based.

### `/components`
Componentes reutilizáveis divididos por responsabilidade:
- **Layout**: Header, Footer (quando necessário)
- **Pages**: PaginaInicial, ListaVeiculos, etc
- **Forms**: NovoVeiculo, NovoServico
- **UI**: Card, FormField, Toast, ConfirmDialog

### `/hooks`
Hooks customizados para lógica compartilhada:
- `useToast`: Gerencia notificações
- `useFormulario`: Validação e gerenciamento de estado de formulários
- `useNavegacao`: Histórico de navegação

### `/lib`
Utilitários e camada de dados:
- `types.ts`: Tipos TypeScript centralizados
- `supabase.ts`: Serviço de dados (mock que será substituído por real)
- `utils.ts`: Funções utilitárias

## Fluxo de Dados

```
App (page.tsx)
  ├── State de navegação (telaAtual, historico)
  ├── State de entidades (veiculoSelecionado, servicoSelecionado)
  └── Renderiza componente baseado em telaAtual
      └── Componente usa hooks (useFormulario, useToast)
          └── Chama serviço (supabaseService)
              └── Atualiza localStorage
```

## Padrões de Design

### 1. Componentes Funcionais com Hooks
Todos os componentes são funcionais e usam hooks para estado e efeitos.

```tsx
export default function MeuComponente(props) {
  const [estado, setEstado] = useState()
  const { sucesso, erro } = useToast()
  
  return <div>{/* JSX */}</div>
}
```

### 2. Validação em Tempo Real
O hook `useFormulario` valida enquanto o usuário digita:

```tsx
const form = useFormulario(valorInicial, validadores)
form.handleMudanca(event)  // Valida automaticamente
form.validarTudo()         // Valida tudo antes de enviar
```

### 3. Navegação com Histórico
A navegação é gerenciada no componente raiz com histórico:

```tsx
const [historico, setHistorico] = useState([])
const irPara = (tela) => {
  setHistorico([...historico, telaAtual])
  setTelaAtual(tela)
}
const voltar = () => {
  const telaAnterior = historico.pop()
  setTelaAtual(telaAnterior)
}
```

### 4. Camada de Serviço
O `supabaseService` é um singleton que centraliza toda a lógica de dados:

```tsx
await supabaseService.criarVeiculo(dados)
const servicos = await supabaseService.obterServicos(veiculoId)
```

## Fluxo de Features

### Criar Novo Veículo
```
NovoVeiculo.tsx
  └── useFormulario (validação)
      └── supabaseService.criarVeiculo()
          └── localStorage.setItem()
              └── onSalvar callback
                  └── irPara('detalhes-veiculo')
```

### Registrar Serviço
```
NovoServico.tsx
  ├── useEffect: busca modelo conhecido
  ├── useFormulario: valida campos
  └── supabaseService.criarServico()
      ├── Atualiza modelo conhecido
      └── localStorage.setItem()
          └── onSalvar callback
```

### Buscar Veículos
```
ListaVeiculos.tsx
  ├── useEffect: carrega todos
  ├── useMemo: filtra/ordena com regex
  └── Renderiza resultado em tempo real
```

## Preparação Para Futuro

A arquitetura está preparada para:

### 1. Integração com Supabase
```tsx
// Trocar lib/supabase.ts para usar @supabase/supabase-js
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(url, key)
```

### 2. Autenticação Multi-Técnico
```tsx
// Adicionar Better Auth + Supabase
- Middleware para proteção de rotas
- Context de usuário logado
- Escopo de dados por usuário
```

### 3. Upload de Fotos
```tsx
// Adicionar Vercel Blob ou Supabase Storage
- Campo de camera em formulários
- Galeria de fotos por veículo
```

### 4. Assinatura Digital
```tsx
// Adicionar biblioteca de assinatura
- Campos de assinatura em serviços
- Geração de PDF com assinatura
```

### 5. Dashboard Avançado
```tsx
// Adicionar biblioteca de gráficos (Recharts)
- Gráficos de tendências
- Comparações mensais
- Análise de técnicos
```

## Convenções de Código

### Nomenclatura
- Componentes: PascalCase (`PaginaInicial`)
- Funções/variáveis: camelCase (`obterVeiculos`)
- Tipos: PascalCase (`Veiculo`)
- Constantes: UPPER_SNAKE_CASE (`STORAGE_KEY`)

### Estrutura de Componente
```tsx
'use client'

import { Dependências }
import { Componentes internos }

interface Props {
  // Props tipadas
}

export default function MeuComponente(props: Props) {
  // State
  // Effects
  // Handlers
  // Render
}
```

### Tipos
Todos os tipos ficam em `lib/types.ts`:
```tsx
export interface Veiculo {
  id: string
  cliente: Cliente
  // ...
}

export type TipoServico = 'instalacao' | 'manutencao' | 'remocao'
```

## Performance

### Otimizações Implementadas
- Componentes reutilizáveis reduzem duplicação
- useMemo para cálculos pesados (filtros/ordenação)
- localStorage para cache local
- Lazy loading de dados com useEffect

### Otimizações Futuras
- Code splitting por rota
- Image optimization com next/image
- Dynamic imports para componentes pesados
- Service Worker para offline

## Segurança

### Implementado
- Validação de entrada em todos os formulários
- Prevenção de SQL injection (via serviço)
- CSRF protection (via Next.js padrão)
- Sanitização de strings

### Futuro (com autenticação)
- Row Level Security (RLS) no Supabase
- Rate limiting em APIs
- Logs de auditoria
- Backup automático

## Testes

### Estrutura Recomendada
```
tests/
├── unit/
│   ├── hooks/
│   │   └── useFormulario.test.ts
│   └── lib/
│       └── supabase.test.ts
├── integration/
│   └── components/
│       └── NovoVeiculo.test.tsx
└── e2e/
    └── criar-veiculo.test.ts
```

### Ferramenta Recomendada
- Jest + React Testing Library

## Deployment

### Build
```bash
pnpm build
pnpm start
```

### Variáveis de Ambiente
```env
# .env.production
NEXT_PUBLIC_SUPABASE_URL=seu-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave
```

### Plataformas Suportadas
- Vercel (recomendado)
- Docker
- Node.js 18+

## Documentação de APIs

### supabaseService.obterVeiculos()
Retorna todos os veículos cadastrados.

### supabaseService.criarVeiculo(dados)
Cria novo veículo. Previne duplicatas por placa.

### supabaseService.criarServico(dados)
Cria novo serviço e atualiza modelo conhecido automaticamente.

### supabaseService.obterUltimosServicos(limite)
Retorna últimos N serviços ordenados por data.

## Roadmap

- [ ] Autenticação com Better Auth
- [ ] Upload de fotos com Vercel Blob
- [ ] Geração de PDF de serviços
- [ ] Assinatura digital
- [ ] Dashboard com gráficos
- [ ] Backup automático
- [ ] Sincronização offline
- [ ] App móvel nativa (React Native)
- [ ] Integração com GPS em tempo real
- [ ] Notificações push
