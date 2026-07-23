"use client"

import { Clipboard,  } from "lucide-react"
import { ClipboardPaste, Camera } from "lucide-react"

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

      // Mantém apenas números
      onChange(
        texto.replace(/\D/g, "")
      )

    } catch {

      alert("Não foi possível acessar a área de transferência.")

    }
  }

  const valido = value.length === 15

  return (
    <div className="space-y-2">

      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className="flex gap-2">

        <input
          type="text"
          inputMode="numeric"
          maxLength={15}
          value={value}
          onChange={(e) =>
            onChange(
              e.target.value.replace(/\D/g, "")
            )
          }
          className={`
            flex-1
            rounded-xl
            border
            px-4
            py-3
            outline-none
            transition
            ${
              value.length === 0
                ? "border-gray-300"
                : valido
                ? "border-green-600"
                : "border-red-500"
            }
          `}
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
"
        >
          <copy size={20} className="text-gray-700" />
        </button>

        <button
          type="button"
          onClick={onCamera}
          className="
            w-12
            rounded-xl
            bg-[#16A34A]
            text-white
            flex
            items-center
            justify-center
            hover:bg-green-700
            transition
          "
        >
          <Camera size={20}
          className="text-white" />
        </button>

      </div>

      <div className="flex justify-between text-xs">

        <span className="text-gray-500">
          {value.length}/15 dígitos
        </span>

        {value.length > 0 && (
          <span
            className={
              valido
                ? "text-green-600 font-medium"
                : "text-red-500"
            }
          >
            {valido ? "✓ IMEI válido" : "IMEI incompleto"}
          </span>
        )}

      </div>

    </div>
  )
}