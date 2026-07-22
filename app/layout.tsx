import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Base de Instalações",
  description: "Base inteligente de instalações de rastreadores",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}