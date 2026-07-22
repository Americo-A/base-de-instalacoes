import { ReactNode } from "react"
import clsx from "clsx"

interface PageContainerProps {
  children: ReactNode
  className?: string
}

export default function PageContainer({
  children,
  className,
}: PageContainerProps) {
  return (
    <main
      className={clsx(
        `
          min-h-screen
          bg-gray-50
          px-4
          py-5
          pb-8
        `,
        className
      )}
    >
      {children}
    </main>
  )
}