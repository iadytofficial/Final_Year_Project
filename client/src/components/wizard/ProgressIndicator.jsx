export default function ProgressIndicator({ current, total }) {
  return (
    <div className="flex items-center justify-center gap-2 py-4 text-sm">
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} className={`h-2 w-10 rounded-full ${i<=current?'bg-brand':'bg-gray-300'}`} />
      ))}
    </div>
  )
}
