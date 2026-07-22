"use client"

import { Search, X } from "lucide-react"
import { useEffect, useState } from "react"

interface SearchInputProps {
  value: string
  placeholder?: string
  delay?: number
  onChange: (value: string) => void
}

export default function SearchInput({
  value,
  placeholder = "Pesquisar...",
  delay = 300,
  onChange,
}: SearchInputProps) {
  const [text, setText] = useState(value)

  useEffect(() => {
    setText(value)
  }, [value])

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(text)
    }, delay)

    return () => clearTimeout(timer)
  }, [text, delay, onChange])

  function limpar() {
    setText("")
    onChange("")
  }

  return (
    <div
      className="
      text-gray-900
        flex
        items-center
        gap-3
        h-14
        px-4
        rounded-2xl
        bg-white
        border
        border-gray-200
        shadow-sm
        transition-all
        focus-within:border-gray-900
        focus-within:ring-2
        focus-within:ring-gray-200
      "
    >
      <Search
        size={20}
        className="text-gray-400 flex-shrink-0"
      />

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        className="
          flex-1
          bg-transparent
          outline-none
          text-[16px]
          placeholder:text-gray-400
        "
      />

      {text.length > 0 && (
        <button
          onClick={limpar}
          className="
          text-gray-900
            flex
            items-center
            justify-center
            w-7
            h-7
            rounded-full
            bg-gray-100
            active:scale-95
            transition
          "
        >
          <X
            size={16}
            className="text-gray-500"
          />
        </button>
      )}
    </div>
  )
}