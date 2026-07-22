export default function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="
          h-24
          rounded-2xl
          bg-gray-200
          animate-pulse
        "
        />
      ))}
    </div>
  )
}