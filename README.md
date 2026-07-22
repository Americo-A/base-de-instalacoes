# Controle de Instalações

Um aplicativo profissional e responsivo para Android/Web desenvolvido com **Next.js 16**, **React 19**, **TypeScript**, **Tailwind CSS 4** e **Supabase**, focado em controlar instalações, manutenções e remoções de rastreadores veiculares.

## Características

- **Dashboard Estatístico**: Visualize total de veículos, serviços e análises mensais com comparação com mês anterior
- **Gestão de Veículos**: Criar, listar, buscar e gerenciar veículos com dados completos
- **Registro de Serviços**: Registre instalações, manutenções e remoções com detalhes completos  
- **Modelos Conhecidos**: Sistema inteligente que sugere configurações automaticamente
- **Atividade Recente**: Acompanhe os últimos 30 serviços com busca e filtros avançados
- **Interface Mobile-First**: Otimizado para smartphones e tablets
- **Busca Inteligente**: Busca em tempo real com suporte a acentuação e ignorando maiúsculas/minúsculas
- **Validação Completa**: Validação de formulários com Zod + React Hook Form
- **Notificações**: Toast de sucesso e erro para todas as operações
- **Integração Supabase**: Banco de dados relacional com PostgreSQL
- **React Query**: Cache automático e sincronização de dados
- **Tipagem Completa**: TypeScript strict mode para máxima segurança

## Pré-requisitos

- Node.js 18+ 
- pnpm ou npm
- Conta no Supabase (https://supabase.com)
- Variáveis de ambiente configuradas

## Instalação

1. Clone o repositório:
```bash
git clone <seu-repositorio>
cd controle-instalacoes
```

2. Instale as dependências:
```bash
pnpm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
# Adicione suas credenciais do Supabase
```

4. Inicie o servidor de desenvolvimento:
```bash
pnpm dev
```

5. Abra [http://localhost:3000](http://localhost:3000) no seu navegador

## Setup Supabase

Veja o arquivo [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) para instruções completas de configuração do banco de dados, schema e triggers.

## Estrutura do Projeto

```
├── app/
│   ├── layout.tsx              # Layout raiz
│   ├── page.tsx                # Página principal com navegação
│   └── globals.css             # Estilos globais e tema
├── components/
│   ├── Header.tsx              # Cabeçalho padrão com navegação
│   ├── Dashboard.tsx           # Cartões de estatísticas
│   ├── PaginaInicial.tsx       # Tela inicial com menu
│   ├── NovoVeiculo.tsx         # Formulário de novo veículo
│   ├── ListaVeiculos.tsx       # Lista com busca e filtros
│   ├── DetalhesVeiculo.tsx     # Detalhes do veículo
│   ├── NovoServico.tsx         # Formulário de novo serviço
│   ├── HistoricoVeiculo.tsx    # Histórico de serviços
│   ├── DetalhesServico.tsx     # Detalhes do serviço
│   ├── AtividadeRecente.tsx    # Últimos 30 serviços
│   ├── ModelosConhecidos.tsx   # Modelos com configurações
│   ├── Card.tsx                # Componente Card reutilizável
│   ├── FormField.tsx           # Componentes de formulário
│   ├── Toast.tsx               # Notificações
│   ├── ConfirmDialog.tsx       # Diálogos de confirmação
│   └── ui/
│       └── button.tsx          # Botão do shadcn/ui
├── hooks/
│   ├── useToast.ts             # Hook para gerenciar toasts
│   ├── useFormulario.ts        # Hook para validação de formulários
│   └── useNavegacao.ts         # Hook para navegação
├── lib/
│   ├── types.ts                # Tipos TypeScript
│   ├── supabase.ts             # Serviço mock de dados
│   └── utils.ts                # Utilidades
└── public/                     # Assets estáticos
```

## Uso

### Tela Inicial
- Visualize o dashboard com estatísticas principais
- Acesse as seções através dos botões do menu

### Novo Veículo
1. Preencha os dados do cliente (nome obrigatório)
2. Preencha os dados do veículo (placa e modelo obrigatórios)
3. Use "Pegar Localização Atual" para geocodificação
4. Salve para ir automaticamente aos detalhes

### Gestão de Serviços
1. Acesse um veículo e clique "Novo Serviço"
2. Selecione o tipo de serviço
3. Preencha as ligações (positivo, negativo, pós-chave)
4. O sistema sugerirá configurações do modelo se disponível
5. Salve e o histórico será atualizado automaticamente

### Busca e Filtros
- Busque por cliente, placa, modelo, marca, etc.
- Filtre por tipo de serviço ou período
- A busca ignora acentuação e maiúsculas/minúsculas

## Integração com Supabase

O aplicativo está totalmente integrado com Supabase. Aqui está a arquitetura:

### Arquitetura de Dados

```
┌─────────────────────────────────────┐
│ React Components                    │
│ (usar hooks: useVeiculos, etc)      │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│ React Query                         │
│ (cache automático e sincronização)  │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│ Services (lib/supabase.ts)          │
│ (queryFn reutilizáveis)             │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│ Supabase Client                     │
│ (TypeScript + RealTime)             │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│ Supabase Database (PostgreSQL)      │
│ com Triggers Automáticas            │
└─────────────────────────────────────┘
```

### Como Adicionar Novos Dados

1. **Criar tipos** em `lib/types.ts`
2. **Criar validações** em `lib/validations.ts`  
3. **Criar serviços** em `lib/supabase.ts`
4. **Criar hooks** em `hooks/useNome.ts`
5. **Usar nos componentes** com React Query

### Exemplo:

```typescript
// Hook
const { data, isLoading, error } = useVeiculos()

// Service
export async function getVeiculos() {
  const { data, error } = await supabase.from('veiculos').select('*')
  if (error) throw error
  return data as Veiculo[]
}

## Arquitetura Preparada Para

- Login de múltiplos técnicos (com Better Auth + Neon)
- Upload de fotos (com Vercel Blob)
- Geração de PDF (com bibliotecas padrão)
- Assinatura digital
- Dashboard avançado com gráficos
- Backup automático
- Sincronização offline

## Validações

Campos obrigatórios:
- **Novo Veículo**: Nome do Cliente, Placa, Modelo
- **Novo Serviço**: Tipo, Data, Responsável, Positivo, Negativo, Pós-chave

Outras validações:
- Nunca criar veículos com placa duplicada
- Todo serviço deve pertencer a um veículo existente
- Modelos conhecidos são atualizados automaticamente

## Atalhos de Teclado

- `Ctrl/Cmd + Enter`: Salvar formulário (quando implementado)
- Navegação por abas com `Tab`

## Suporte a Localização

O app solicita permissão para acessar a localização do usuário e converte coordenadas em formato de texto. A localização é completamente opcional e pode ser editada manualmente.

## Performance

- Componentes otimizados com React.memo
- Lazy loading de dados
- Busca debounced
- Local caching com localStorage
- CSS crítico inline no layout

## Responsividade

- Mobile-first design
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly com áreas de clique de 44px mínimo
- Suporte a landscape/portrait

## Desenvolvimento

### Build para produção:
```bash
pnpm build
pnpm start
```

### Lint:
```bash
pnpm lint
```

### Variáveis de ambiente:
Copie `.env.example` para `.env.local` e atualize conforme necessário

## Troubleshooting

**Localização não funciona**: Verifique se o navegador tem permissão para acessar localização

**Dados não persistem**: O app usa localStorage. Limpe o cache se tiver problemas

**Servidor não inicia**: Verifique a porta 3000, pode estar em uso. Use `PORT=3001 pnpm dev`

## Licença

Privado - Uso interno apenas

## Contato

Para dúvidas ou bugs, entre em contato com o time de desenvolvimento.
