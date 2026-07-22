import { SearchX } from "lucide-react"

interface Props {
  title: string
  description: string
}

export default function EmptyState({
  title,
  description,
}: Props) {
  return (
    <div
      className="
      flex
      flex-col
      items-center
      justify-center
      py-14
      text-center
    "
    >
      <SearchX
        size={42}
        className="text-gray-300"
      />

      <h2 className="mt-5 font-semibold text-lg">
        {title}
      </h2>

      <p
        className="
        mt-2
        text-gray-500
        text-sm
        max-w-xs
      "
      >
        {description}
      </p>
    </div>
  )
}