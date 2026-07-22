# Guia de Expansão - Controle de Instalações

Este documento apresenta como adicionar novas funcionalidades ao aplicativo.

## 1. Adicionar Login de Múltiplos Técnicos

### Passo 1: Instalar Better Auth
```bash
pnpm add better-auth
```

### Passo 2: Criar Tabela de Usuários
```sql
CREATE TABLE auth_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  nome TEXT NOT NULL,
  senha_hash TEXT NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Adicionar coluna de usuário aos serviços
ALTER TABLE servicos ADD COLUMN usuario_id UUID REFERENCES auth_users(id);
```

### Passo 3: Criar Contexto de Autenticação
```tsx
// lib/auth.ts
import { createContext, useContext } from 'react'

interface Usuario {
  id: string
  email: string
  nome: string
}

const AutContext = createContext<Usuario | null>(null)

export function useAuth() {
  return useContext(AutContext)
}
```

### Passo 4: Proteger Rotas
```tsx
// app/layout.tsx
import { middleware } from 'lib/auth'

export const authMiddleware = middleware({
  publicRoutes: ['/login', '/signup']
})
```

## 2. Upload de Fotos

### Passo 1: Integrar Vercel Blob
```bash
pnpm add @vercel/blob
```

### Passo 2: Criar Tabela de Fotos
```sql
CREATE TABLE fotos_veiculo (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  veiculo_id UUID NOT NULL REFERENCES veiculos(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  descricao TEXT,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE fotos_servico (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  servico_id UUID NOT NULL REFERENCES servicos(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  descricao TEXT,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Passo 3: Componente de Upload
```tsx
// components/UploadFoto.tsx
'use client'

import { useRef } from 'react'
import { upload } from '@vercel/blob/client'
import { Button } from '@/components/ui/button'
import { Camera } from 'lucide-react'

export function UploadFoto({ onUploaded }: { onUploaded: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const blob = await upload(file.name, file, {
        access: 'private',
        handleBlobUrl: () => {}, // Suprimir handler padrão
      })
      
      onUploaded(blob.url)
    } catch (error) {
      console.error('Erro ao upload:', error)
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />
      <Button
        onClick={() => inputRef.current?.click()}
        className="gap-2"
      >
        <Camera className="w-4 h-4" />
        Tirar Foto
      </Button>
    </div>
  )
}
```

## 3. Gerar PDF de Serviço

### Passo 1: Instalar Biblioteca PDF
```bash
pnpm add html2pdf
```

### Passo 2: Criar Componente de PDF
```tsx
// components/GerarPDF.tsx
'use client'

import html2pdf from 'html2pdf'
import { Button } from '@/components/ui/button'
import { FileText } from 'lucide-react'
import { Servico } from '@/lib/types'

export function GerarPDF({ servico }: { servico: Servico }) {
  const handleGerarPDF = () => {
    const elemento = document.getElementById(`servico-${servico.id}`)
    if (!elemento) return

    const opcoes = {
      margin: 10,
      filename: `OS-${servico.id.slice(0, 6)}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
    }

    html2pdf().set(opcoes).from(elemento).save()
  }

  return (
    <Button onClick={handleGerarPDF} className="gap-2">
      <FileText className="w-4 h-4" />
      Gerar PDF
    </Button>
  )
}
```

## 4. Adicionar Dashboard com Gráficos

### Passo 1: Instalar Recharts
```bash
pnpm add recharts
```

### Passo 2: Criar Componente de Gráfico
```tsx
// components/GraficoServicos.tsx
'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { Servico } from '@/lib/types'

export function GraficoServicos({ servicos }: { servicos: Servico[] }) {
  // Agrupar serviços por mês
  const dados = Array.from({ length: 12 }, (_, i) => {
    const mes = i + 1
    const mesAno = new Date().getFullYear() + '-' + String(mes).padStart(2, '0')
    const quantidade = servicos.filter(s => 
      s.data.toISOString().startsWith(mesAno)
    ).length
    return { mes, quantidade }
  })

  return (
    <LineChart width={400} height={300} data={dados}>
      <CartesianGrid />
      <XAxis dataKey="mes" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="quantidade" stroke="#3b82f6" />
    </LineChart>
  )
}
```

## 5. Adicionar Filtro por Técnico

### Modificar Serviço
```tsx
// Em NovoServico.tsx, adicione:
<FormField label="Técnico" obrigatorio>
  <Select
    name="tecnico"
    opcoes={[
      { value: 'tecnico1', label: 'Técnico 1' },
      { value: 'tecnico2', label: 'Técnico 2' },
    ]}
    value={form.valores.tecnico}
    onChange={form.handleMudanca}
    placeholderLabel="Selecione"
  />
</FormField>
```

## 6. Adicionar Sistema de Checklist

### Criar Nova Tabela
```sql
CREATE TABLE checklists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  servico_id UUID NOT NULL REFERENCES servicos(id),
  item TEXT NOT NULL,
  concluido BOOLEAN DEFAULT FALSE,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Componente
```tsx
// components/Checklist.tsx
'use client'

import { useState } from 'react'
import { Checkbox } from '@/components/FormField'

export function Checklist({ items }: { items: string[] }) {
  const [concluidos, setConcluidos] = useState<Set<number>>(new Set())

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <Checkbox
          key={i}
          label={item}
          checked={concluidos.has(i)}
          onChange={(e) => {
            const novo = new Set(concluidos)
            if (e.target.checked) {
              novo.add(i)
            } else {
              novo.delete(i)
            }
            setConcluidos(novo)
          }}
        />
      ))}
    </div>
  )
}
```

## 7. Integração com GPS em Tempo Real

### Rastrear Localização
```tsx
// hooks/useGPS.ts
import { useEffect, useState } from 'react'

export function useGPS() {
  const [localizacao, setLocalizacao] = useState<{
    latitude: number
    longitude: number
  } | null>(null)

  useEffect(() => {
    let watchId: number

    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          setLocalizacao({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        (error) => console.error(error)
      )
    }

    return () => navigator.geolocation.clearWatch(watchId)
  }, [])

  return localizacao
}
```

## 8. Sincronização Offline

### Implementar IndexedDB
```bash
pnpm add idb
```

```tsx
// lib/offline.ts
import { openDB } from 'idb'

const DB_NAME = 'controle-instalacoes'
const STORE_NAME = 'operacoes-pendentes'

export async function adicionarOperacaoPendente(operacao: any) {
  const db = await openDB(DB_NAME)
  await db.add(STORE_NAME, operacao)
}

export async function sincronizar() {
  const db = await openDB(DB_NAME)
  const operacoes = await db.getAll(STORE_NAME)

  for (const op of operacoes) {
    try {
      // Sincronizar com Supabase
      await supabaseService[op.acao](op.dados)
      await db.delete(STORE_NAME, op.id)
    } catch (error) {
      console.error('Erro ao sincronizar:', error)
    }
  }
}
```

## 9. Notificações Push

### Registrar Service Worker
```tsx
// lib/notifications.ts
export async function registrarNotificacoes() {
  if (!('serviceWorker' in navigator)) return

  const registration = await navigator.serviceWorker.register('/sw.js')
  return registration
}

export async function enviarNotificacao(titulo: string, opcoes?: any) {
  const registration = await navigator.serviceWorker.ready
  await registration.showNotification(titulo, opcoes)
}
```

## 10. Temas Customizáveis

### Sistema de Temas
```tsx
// lib/themes.ts
export const temas = {
  azul: {
    primary: '#3b82f6',
    background: '#ffffff',
    // ...
  },
  escuro: {
    primary: '#1e40af',
    background: '#0f172a',
    // ...
  },
}

// hooks/useTema.ts
import { useState, useEffect } from 'react'

export function useTema() {
  const [tema, setTema] = useState('azul')

  useEffect(() => {
    localStorage.setItem('tema', tema)
    document.documentElement.setAttribute('data-tema', tema)
  }, [tema])

  return { tema, setTema }
}
```

## Checklist de Expansão

- [ ] Adicionar autenticação
- [ ] Integrar Supabase
- [ ] Upload de fotos
- [ ] Gerar PDF
- [ ] Dashboard com gráficos
- [ ] Filtrar por técnico
- [ ] Sistema de checklist
- [ ] GPS em tempo real
- [ ] Sincronização offline
- [ ] Notificações push
- [ ] Temas customizáveis
- [ ] Mobile app nativa (React Native)
- [ ] Backup automático
- [ ] Integração com CRM

## Performance Tips

1. **Lazy Load**: `React.lazy()` para componentes pesados
2. **Memoization**: `useMemo()` para cálculos pesados
3. **Debounce**: `useCallback()` com delay para busca
4. **Virtualization**: `react-window` para listas longas
5. **Code Splitting**: Divida rotas em chunks

## Segurança

1. Sempre validar dados no servidor
2. Usar HTTPS em produção
3. RLS no Supabase para dados do usuário
4. Limpar dados sensíveis do localStorage
5. CORS configurado corretamente

## Recursos Úteis

- [Documentação Next.js 16](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Query para dados](https://tanstack.com/query)
- [Zod para validação](https://zod.dev)

Boa sorte na expansão!
