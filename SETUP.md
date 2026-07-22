# Guia de Setup - Controle de Instalações

## Início Rápido

### 1. Requisitos
- Node.js 18+ instalado
- npm ou pnpm
- Um navegador moderno

### 2. Instalação

```bash
# Clone o repositório (ou extraia o ZIP)
cd controle-instalacoes

# Instale as dependências
pnpm install

# Inicie o servidor de desenvolvimento
pnpm dev
```

O aplicativo abrirá em `http://localhost:3000`

## Funcionalidades Atuais

### Dados Mock (localStorage)
Todos os dados são armazenados em localStorage do navegador. Atualize a página e os dados persistem.

**Dados de Exemplo Inclusos:**
- 1 veículo de exemplo (Corolla/Toyota, placa ABC1234)
- 0 serviços (adicione o seu primeiro!)

### Como Testar

1. **Dashboard**: Vê o total de veículos, serviços e estatísticas
2. **Novo Veículo**: Crie um novo veículo com geolocalização
3. **Lista de Veículos**: Busque e filtre veículos
4. **Novo Serviço**: Registre uma instalação/manutenção/remoção
5. **Atividade Recente**: Veja os últimos 30 serviços
6. **Modelos Conhecidos**: Sistema aprende configurações

## Integração com Supabase (Próximo Passo)

### 1. Criar Conta Supabase
- Acesse https://supabase.com
- Clique "Start your project"
- Crie uma conta (Google, GitHub, etc)
- Crie um novo projeto

### 2. Criar Tabelas no Supabase

Execute o SQL abaixo no console do Supabase:

```sql
-- Tabela de Veículos
CREATE TABLE veiculos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_nome TEXT NOT NULL,
  cliente_telefone TEXT,
  cliente_endereco TEXT,
  placa TEXT NOT NULL UNIQUE,
  modelo TEXT NOT NULL,
  marca TEXT,
  ano INTEGER,
  chassi TEXT,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Serviços
CREATE TABLE servicos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  veiculo_id UUID NOT NULL REFERENCES veiculos(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('instalacao', 'instalacao_bloqueio', 'manutencao', 'remocao')),
  data DATE NOT NULL,
  responsavel TEXT NOT NULL,
  positivo TEXT NOT NULL,
  negativo TEXT NOT NULL,
  pos_chave TEXT NOT NULL,
  imei TEXT,
  imei_antigo TEXT,
  imei_novo TEXT,
  anti_furto BOOLEAN DEFAULT FALSE,
  cor_corte TEXT,
  local_instalacao TEXT,
  observacoes TEXT,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Modelos Conhecidos
CREATE TABLE modelos_conhecidos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  marca TEXT NOT NULL,
  modelo TEXT NOT NULL,
  positivo TEXT,
  negativo TEXT,
  pos_chave TEXT,
  anti_furto BOOLEAN,
  cor_corte TEXT,
  local_instalacao TEXT,
  quantidade_utilizada INTEGER DEFAULT 0,
  ultima_utilizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  eh_padrao BOOLEAN DEFAULT FALSE,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(marca, modelo)
);

-- Índices para performance
CREATE INDEX idx_veiculos_placa ON veiculos(placa);
CREATE INDEX idx_servicos_veiculo_id ON servicos(veiculo_id);
CREATE INDEX idx_servicos_data ON servicos(data DESC);
CREATE INDEX idx_modelos_marca_modelo ON modelos_conhecidos(marca, modelo);
```

### 3. Habilitar Row Level Security (RLS)

```sql
-- RLS para Veículos
ALTER TABLE veiculos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Veículos acessíveis por todos" ON veiculos
  FOR ALL USING (TRUE);

-- RLS para Serviços
ALTER TABLE servicos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Serviços acessíveis por todos" ON servicos
  FOR ALL USING (TRUE);

-- RLS para Modelos Conhecidos
ALTER TABLE modelos_conhecidos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Modelos acessíveis por todos" ON modelos_conhecidos
  FOR ALL USING (TRUE);
```

### 4. Obter Chaves de API

- Vá para Settings > API > Project API keys
- Copie `NEXT_PUBLIC_SUPABASE_URL` (URL pública)
- Copie `NEXT_PUBLIC_SUPABASE_ANON_KEY` (chave anônima pública)

### 5. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
```

### 6. Atualizar Código

Abra `lib/supabase.ts` e substitua a classe `SupabaseService` para usar o cliente real:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Depois atualize os métodos para usar supabase.from(), .insert(), etc
```

### 7. Reiniciar Servidor

```bash
# Ctrl+C para parar
# Inicie novamente
pnpm dev
```

## Migrando Dados do localStorage para Supabase

```bash
# Quando em produção com Supabase, implemente uma função de migração
# que lê dados do localStorage e insere no Supabase
```

## Variáveis de Ambiente

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do Supabase | `https://projeto.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave pública | `eyJh...` |
| `NODE_ENV` | Ambiente | `development` / `production` |
| `PORT` | Porta do servidor | `3000` (padrão) |

## Deploy para Produção

### Opção 1: Vercel (Recomendado)

1. Faça push para GitHub
2. Conecte o repositório no Vercel
3. Adicione as variáveis de ambiente
4. Deploy automático!

```bash
# No Vercel Dashboard:
# Settings > Environment Variables
# Adicione NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Opção 2: Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
```

```bash
docker build -t controle-instalacoes .
docker run -p 3000:3000 controle-instalacoes
```

## Troubleshooting

### "localStorage is not defined"
- Erro comum em SSR
- Já corrigido no código (`if (typeof window === 'undefined') return`)
- Se persistir, limpe `.next` e rebuild

### Dados desapareceram
- localStorage foi limpo
- Verifique Settings > Application > Storage > Local Storage no DevTools
- Dados mock são recarregados automaticamente

### Geolocalização não funciona
- Navegador precisa de HTTPS (ou localhost)
- Usuário deve conceder permissão
- Alguns browsers impedem em iframes

### Busca lenta
- Aplicativo faz busca no cliente (rápido)
- Com Supabase, implemente busca no servidor para melhor performance

## Próximos Passos Recomendados

1. ✅ Testar com dados mock (agora!)
2. ⏭️ Integrar com Supabase (ver seção acima)
3. ⏭️ Adicionar autenticação com Better Auth
4. ⏭️ Deploy no Vercel
5. ⏭️ Adicionar upload de fotos
6. ⏭️ Integrar PDF/Assinatura digital

## Dúvidas Frequentes

**P: Posso usar isso offline?**
R: Sim! Dados em localStorage trabalham offline. Supabase sincronizará quando voltar online.

**P: Como faço backup dos dados?**
R: No Supabase, use o painel para export/backup. No localStorage, exporte pelo DevTools.

**P: Posso customizar a interface?**
R: Sim! Modifique `app/globals.css` e componentes em `components/`.

**P: Quantos usuários suporta?**
R: Com Supabase gratuito, até 50k usuários. Scales infinitamente com planos pagos.

**P: Como adiciono novos campos?**
R: 1. Atualize tipo em `lib/types.ts`
   2. Adicione coluna no Supabase
   3. Atualize formulário
   4. Pronto!

## Suporte

- Documentação: Veja `README.md` e `ARCHITECTURE.md`
- Issues: GitHub Issues no seu repositório
- Comunidade: Discord do Vercel/Supabase

## Licença

Privado - Uso interno
