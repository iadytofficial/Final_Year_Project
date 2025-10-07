import { useEffect } from 'react'

export default function MessageModal({ open, title, children, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose?.() }
    if (open) window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded bg-white shadow">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="font-medium">{title}</h3>
          <button onClick={onClose} className="text-gray-500">✕</button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  )
}
