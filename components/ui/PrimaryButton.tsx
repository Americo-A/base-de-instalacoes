import { ButtonHTMLAttributes } from "react"
import clsx from "clsx"

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {}

export default function PrimaryButton({
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
        bg-gray-900
        text-white
        font-medium
        text-sm
        transition-all
        duration-200
        active:scale-[0.98]
        disabled:opacity-50
        disabled:pointer-events-none
        `,
        className
      )}
    >
      {children}
    </button>
  )
}