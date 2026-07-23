"use client"

import { Suspense } from "react"
import NovaInstalacaoForm from "./NovaInstalacaoForm"

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <NovaInstalacaoForm />
    </Suspense>
  )
}