# Setup do Supabase

Este aplicativo utiliza o Supabase como banco de dados. Siga estas instruções para configurar o projeto.

## Passo 1: Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma nova conta ou faça login
3. Crie um novo projeto
4. Anote a URL e a Anon Key

## Passo 2: Configurar Banco de Dados

O banco de dados já deve estar criado com as seguintes tabelas:

### Tabela: veiculos

```sql
CREATE TABLE veiculos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente TEXT NOT NULL,
  telefone TEXT NOT NULL,
  endereco TEXT,
  placa TEXT NOT NULL UNIQUE,
  marca TEXT NOT NULL,
  modelo TEXT NOT NULL,
  ano INTEGER,
  chassi TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_veiculos_cliente ON veiculos(cliente);
CREATE INDEX idx_veiculos_placa ON veiculos(placa);
CREATE INDEX idx_veiculos_modelo ON veiculos(modelo);
```

### Tabela: servicos

```sql
CREATE TABLE servicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_os BIGSERIAL UNIQUE,
  veiculo_id UUID NOT NULL REFERENCES veiculos(id) ON DELETE CASCADE,
  data DATE NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('instalacao', 'instalacao_com_bloqueio', 'manutencao', 'remocao')),
  responsavel TEXT NOT NULL,
  positivo TEXT NOT NULL,
  negativo TEXT NOT NULL,
  pos_chave TEXT NOT NULL,
  imei TEXT,
  imei_antigo TEXT,
  imei_novo TEXT,
  anti_furto TEXT,
  cor_corte TEXT,
  local_instalacao TEXT,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_servicos_veiculo ON servicos(veiculo_id);
CREATE INDEX idx_servicos_data ON servicos(data);
CREATE INDEX idx_servicos_tipo ON servicos(tipo);
```

### Tabela: modelos_conhecidos

```sql
CREATE TABLE modelos_conhecidos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  marca TEXT NOT NULL,
  modelo TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_modelos_marca ON modelos_conhecidos(marca);
```

### Tabela: configuracoes_modelo

```sql
CREATE TABLE configuracoes_modelo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  modelo_id UUID NOT NULL REFERENCES modelos_conhecidos(id) ON DELETE CASCADE,
  positivo TEXT NOT NULL,
  negativo TEXT NOT NULL,
  pos_chave TEXT NOT NULL,
  imei TEXT,
  anti_furto TEXT,
  cor_corte TEXT,
  local_instalacao TEXT,
  quantidade_utilizada INTEGER DEFAULT 1,
  ultima_utilizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_configuracoes_modelo ON configuracoes_modelo(modelo_id);
```

## Passo 3: Configurar Variáveis de Ambiente

1. Copie o arquivo `.env.example` para `.env.local`:
```bash
cp .env.example .env.local
```

2. Abra `.env.local` e adicione suas credenciais do Supabase:
```
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-aqui
```

## Passo 4: Habilitar RLS (Row Level Security)

Por enquanto, o aplicativo funciona sem RLS. Quando estiver pronto para produção:

1. No Supabase Dashboard, vá para Authentication > Policies
2. Habilite RLS para cada tabela
3. Crie policies apropriadas

## Passo 5: Triggers Automáticas

O Supabase deve ter triggers automáticas para:

1. Gerar `numero_os` automaticamente para serviços
2. Atualizar a tabela `configuracoes_modelo` quando um novo serviço é criado

### Trigger para Número OS

```sql
CREATE OR REPLACE FUNCTION public.generate_numero_os()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.numero_os IS NULL THEN
    SELECT COALESCE(MAX(numero_os), 0) + 1 INTO NEW.numero_os FROM servicos;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_generate_numero_os ON servicos;
CREATE TRIGGER trg_generate_numero_os
BEFORE INSERT ON servicos
FOR EACH ROW
EXECUTE FUNCTION generate_numero_os();
```

### Trigger para Atualizar Configurações do Modelo

```sql
CREATE OR REPLACE FUNCTION public.update_modelo_configuracoes()
RETURNS TRIGGER AS $$
DECLARE
  v_modelo_id UUID;
BEGIN
  -- Buscar o modelo do veículo
  SELECT m.id INTO v_modelo_id
  FROM modelos_conhecidos m
  JOIN veiculos v ON m.marca = v.marca AND m.modelo = v.modelo
  WHERE v.id = NEW.veiculo_id
  LIMIT 1;

  IF v_modelo_id IS NOT NULL THEN
    INSERT INTO configuracoes_modelo (
      modelo_id, positivo, negativo, pos_chave, imei, anti_furto, 
      cor_corte, local_instalacao, quantidade_utilizada, ultima_utilizacao
    ) VALUES (
      v_modelo_id, NEW.positivo, NEW.negativo, NEW.pos_chave, NEW.imei,
      NEW.anti_furto, NEW.cor_corte, NEW.local_instalacao, 1, NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      quantidade_utilizada = configuracoes_modelo.quantidade_utilizada + 1,
      ultima_utilizacao = NOW();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_modelo_configuracoes ON servicos;
CREATE TRIGGER trg_update_modelo_configuracoes
AFTER INSERT ON servicos
FOR EACH ROW
EXECUTE FUNCTION update_modelo_configuracoes();
```

## Testes

Após configurar tudo, teste o aplicativo:

1. Crie um novo veículo
2. Registre um novo serviço
3. Verifique se os dados aparecem corretamente
4. Verifique se o número OS foi gerado automaticamente

## Troubleshooting

### Erro: Missing environment variables

- Verifique se `.env.local` está configurado corretamente
- Reinicie o servidor: `npm run dev`

### Erro: Connection refused

- Verifique se a URL do Supabase está correta
- Verifique sua conexão com a internet

### Erro: UNIQUE constraint violation on placa

- A placa do veículo já existe no banco de dados
- Use uma placa diferente

## Próximos Passos

- Adicionar autenticação com Supabase Auth
- Configurar backups automáticos
- Configurar RLS para segurança em produção
- Configurar CORS se usar domínio customizado
