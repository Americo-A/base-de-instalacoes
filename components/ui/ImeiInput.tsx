"use client"

import { Copy, Camera } from "lucide-react"

interface Props {
  label: string
  value: string
  onChange: (value: string) => void
  onCamera?: () => void
}

export default function ImeiInput({
  label,
  value,
  onChange,
  onCamera,
}: Props) {

  async function colarClipboard() {
    try {
      const texto = await navigator.clipboard.readText()

      onChange(
        texto.replace(/\D/g, "")
      )

    } catch {

      alert("Não foi possível acessar a área de transferência.")

    }
  }

  return (
    <div className="space-y-2">

      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className="flex gap-2">

        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(e) =>
            onChange(
              e.target.value.replace(/\D/g, "")
            )
          }
          className="
            flex-1
            rounded-xl
            border
            border-gray-300
            px-4
            py-3
            outline-none
            focus:border-green-600
          "
        />

        <button
          type="button"
          onClick={colarClipboard}
         className="
         w-12
rounded-xl
border
border-gray-300
bg-white
text-gray-700
hover:bg-gray-100
flex
items-center
justify-center
transition
        ">
          <Copy
  size={20}
  className="text-gray-700"
/>
        </button>

        <button
          type="button"
          onClick={onCamera}
          className="
            w-12
            rounded-xl
            bg-green-600
            text-white
            flex
            items-center
            justify-center
          "
        >
          <Camera size={20} />
        </button>

      </div>

    </div>
  )
}