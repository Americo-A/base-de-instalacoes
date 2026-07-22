import { ButtonHTMLAttributes } from "react"
import clsx from "clsx"

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {}

export default function SecondaryButton({
  className,
  children,
  ...props
}: Props) {
  return (
    <button
      {...props}
      className={clsx(
        `
        w-full
        h-12
        rounded-xl
        border
        border-gray-200
        bg-white
        text-gray-700
        font-medium
        text-sm
        transition-all
        duration-200
        active:scale-[0.98]
        `,
        className
      )}
    >
      {children}
    </button>
  )
}