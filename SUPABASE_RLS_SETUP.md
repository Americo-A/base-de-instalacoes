# Configuração de RLS no Supabase

## Problema
Você está recebendo erro `401 Unauthorized` ao tentar salvar veículos e serviços no Supabase. Isso ocorre porque as tabelas têm **Row Level Security (RLS)** ativada e bloqueando inserts públicos.

## Solução

### Opção 1: Desativar RLS (Recomendado para prototipagem)

1. **Abra o Supabase Dashboard**
   - Acesse: https://app.supabase.com
   - Faça login na sua conta
   - Selecione o projeto `gxsprrtaoesftvtxvwmu`

2. **Vá para SQL Editor**
   - No menu lateral, clique em **"SQL Editor"**
   - Clique em **"New Query"**

3. **Execute o SQL**
   - Copie todo o conteúdo do arquivo `supabase_rls_setup.sql`
   - Cole no SQL Editor
   - Clique em **"Run"** ou pressione `Ctrl+Enter`

4. **Pronto!**
   - Agora você pode salvar veículos e serviços sem erros 401

### Opção 2: Manter RLS com Políticas Públicas (Mais seguro)

Se preferir manter RLS ativada com políticas específicas:

1. **No SQL Editor**, descomente as seções de políticas no arquivo `supabase_rls_setup.sql`
2. Cada política será criada para permitir inserts, selects, updates e deletes públicos
3. Execute o SQL

## Script Completo para Copiar

```sql
-- Desativar RLS em todas as tabelas
ALTER TABLE IF EXISTS public.veiculos DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.servicos DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.modelos_conhecidos DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.configuracoes_modelo DISABLE ROW LEVEL SECURITY;
```

## Verificar se funcionou

1. Volte para o aplicativo
2. Clique em **"Novo Veículo"**
3. Preencha os dados
4. Clique em **"Salvar Veículo"**
5. Você deve ver: ✅ **"Veículo cadastrado com sucesso!"**

## Após executar

- Os dados serão salvos direto no Supabase
- Você verá um diálogo com opções: "Continuar com Instalação", "Voltar" ou "Ver Detalhes"
- Todos os veículos e serviços ficarão armazenados permanentemente no banco de dados

## Documentação Supabase
- RLS: https://supabase.com/docs/guides/auth/row-level-security
- SQL Editor: https://supabase.com/docs/guides/database/sql-editor
