interface FormInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function FormInput({
  label,
  value,
  onChange,
  placeholder,
}: FormInputProps) {
  return (
    <div className="space-y-2">
      <label
        className="
          text-sm
          font-medium
          text-gray-700
        "
      >
        {label}
      </label>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full
          rounded-xl
          border
          border-gray-200
          bg-white
          px-4
          py-3
          outline-none
          transition
          focus:border-blue-500
        "
      />
    </div>
  )
}