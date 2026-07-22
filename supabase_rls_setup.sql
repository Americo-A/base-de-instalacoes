-- ============================================================================
-- Configuração de RLS (Row Level Security) para o App de Rastreamento Veicular
-- Execute este script no SQL Editor do Supabase
-- ============================================================================

-- ============================================================================
-- 1. TABELA: veiculos
-- ============================================================================
-- Desativar RLS para permitir acesso público
ALTER TABLE IF EXISTS public.veiculos DISABLE ROW LEVEL SECURITY;

-- Caso prefira manter RLS ativada, descomente as políticas abaixo
-- ALTER TABLE IF EXISTS public.veiculos ENABLE ROW LEVEL SECURITY;
-- 
-- CREATE POLICY "Allow public insert on veiculos" ON public.veiculos
--   FOR INSERT WITH CHECK (true);
-- 
-- CREATE POLICY "Allow public select on veiculos" ON public.veiculos
--   FOR SELECT USING (true);
-- 
-- CREATE POLICY "Allow public update on veiculos" ON public.veiculos
--   FOR UPDATE USING (true) WITH CHECK (true);
-- 
-- CREATE POLICY "Allow public delete on veiculos" ON public.veiculos
--   FOR DELETE USING (true);

-- ============================================================================
-- 2. TABELA: servicos
-- ============================================================================
-- Desativar RLS para permitir acesso público
ALTER TABLE IF EXISTS public.servicos DISABLE ROW LEVEL SECURITY;

-- Caso prefira manter RLS ativada, descomente as políticas abaixo
-- ALTER TABLE IF EXISTS public.servicos ENABLE ROW LEVEL SECURITY;
-- 
-- CREATE POLICY "Allow public insert on servicos" ON public.servicos
--   FOR INSERT WITH CHECK (true);
-- 
-- CREATE POLICY "Allow public select on servicos" ON public.servicos
--   FOR SELECT USING (true);
-- 
-- CREATE POLICY "Allow public update on servicos" ON public.servicos
--   FOR UPDATE USING (true) WITH CHECK (true);
-- 
-- CREATE POLICY "Allow public delete on servicos" ON public.servicos
--   FOR DELETE USING (true);

-- ============================================================================
-- 3. TABELA: modelos_conhecidos
-- ============================================================================
-- Desativar RLS para permitir acesso público
ALTER TABLE IF EXISTS public.modelos_conhecidos DISABLE ROW LEVEL SECURITY;

-- Caso prefira manter RLS ativada, descomente as políticas abaixo
-- ALTER TABLE IF EXISTS public.modelos_conhecidos ENABLE ROW LEVEL SECURITY;
-- 
-- CREATE POLICY "Allow public insert on modelos_conhecidos" ON public.modelos_conhecidos
--   FOR INSERT WITH CHECK (true);
-- 
-- CREATE POLICY "Allow public select on modelos_conhecidos" ON public.modelos_conhecidos
--   FOR SELECT USING (true);
-- 
-- CREATE POLICY "Allow public update on modelos_conhecidos" ON public.modelos_conhecidos
--   FOR UPDATE USING (true) WITH CHECK (true);
-- 
-- CREATE POLICY "Allow public delete on modelos_conhecidos" ON public.modelos_conhecidos
--   FOR DELETE USING (true);

-- ============================================================================
-- 4. TABELA: configuracoes_modelo
-- ============================================================================
-- Desativar RLS para permitir acesso público
ALTER TABLE IF EXISTS public.configuracoes_modelo DISABLE ROW LEVEL SECURITY;

-- Caso prefira manter RLS ativada, descomente as políticas abaixo
-- ALTER TABLE IF EXISTS public.configuracoes_modelo ENABLE ROW LEVEL SECURITY;
-- 
-- CREATE POLICY "Allow public insert on configuracoes_modelo" ON public.configuracoes_modelo
--   FOR INSERT WITH CHECK (true);
-- 
-- CREATE POLICY "Allow public select on configuracoes_modelo" ON public.configuracoes_modelo
--   FOR SELECT USING (true);
-- 
-- CREATE POLICY "Allow public update on configuracoes_modelo" ON public.configuracoes_modelo
--   FOR UPDATE USING (true) WITH CHECK (true);
-- 
-- CREATE POLICY "Allow public delete on configuracoes_modelo" ON public.configuracoes_modelo
--   FOR DELETE USING (true);

-- ============================================================================
-- Resultado: Todas as tabelas agora permitirão acesso público
-- Você pode agora salvar veículos e serviços sem erros 401
-- ============================================================================
