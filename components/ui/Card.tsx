import { ReactNode } from "react"
import clsx from "clsx"

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export default function Card({
  children,
  className,
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        `
        bg-white
        rounded-2xl
        border
        border-gray-200
        shadow-sm
        p-4
        transition-all
        duration-200
        active:scale-[0.98]
        `,
        onClick &&
          `
          cursor-pointer
          hover:shadow-md
          `,
        className
      )}
    >
      {children}
    </div>
  )
}