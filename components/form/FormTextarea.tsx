interface FormTextareaProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function FormTextarea({
  label,
  value,
  onChange,
  placeholder,
}: FormTextareaProps) {
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

      <textarea
        rows={4}
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
          resize-none
          transition
          focus:border-blue-500
        "
      />
    </div>
  )
}