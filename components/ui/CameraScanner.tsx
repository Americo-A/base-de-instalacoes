"use client"

import { Scanner } from "@yudiel/react-qr-scanner"

interface Props {
  onResult: (value: string) => void
  onClose: () => void
}

export default function CameraScanner({
  onResult,
  onClose,
}: Props) {
  return (
    <div
      className="
        fixed
        inset-0
        bg-black/80
        flex
        items-center
        justify-center
        z-50
      "
    >
      <div
        className="
          bg-white
          rounded-2xl
          p-5
          w-[95%]
          max-w-md
        "
      >
        <h2 className="text-xl font-bold">
          Ler IMEI
        </h2>

        <p className="text-sm text-gray-500 mt-2">
          Aponte a câmera para o QR Code do rastreador.
        </p>

        <div className="mt-4 rounded-xl overflow-hidden">
          <Scanner
            constraints={{
              facingMode: "environment",
            }}
            onScan={(result) => {
              if (!result.length) return

              navigator.vibrate?.(200)

              onResult(result[0].rawValue)
            }}
            onError={(err) => {
              console.log(err)
            }}
            styles={{
              container: {
                width: "100%",
              },
            }}
          />
        </div>

        <button
          onClick={onClose}
          className="
            mt-5
            w-full
            py-3
            rounded-xl
            bg-red-600
            text-white
            font-semibold
          "
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}