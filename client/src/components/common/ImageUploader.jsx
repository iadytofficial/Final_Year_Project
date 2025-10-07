import { useEffect, useRef, useState } from 'react'

export default function ImageUploader({ multiple = true, max = 10, onChange }) {
  const inputRef = useRef(null)
  const [files, setFiles] = useState([])
  const [previews, setPreviews] = useState([])

  useEffect(() => {
    const urls = files.map((f) => URL.createObjectURL(f))
    setPreviews(urls)
    onChange?.(files)
    return () => urls.forEach(URL.revokeObjectURL)
  }, [files, onChange])

  const handleSelect = (e) => {
    const selected = Array.from(e.target.files || [])
    const next = multiple ? [...files, ...selected].slice(0, max) : selected.slice(0, 1)
    setFiles(next)
  }

  return (
    <div>
      <input ref={inputRef} type="file" accept="image/*" multiple={multiple} onChange={handleSelect} className="hidden" />
      <button type="button" onClick={() => inputRef.current?.click()} className="rounded border px-3 py-2">Upload images</button>
      {previews.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-2">
          {previews.map((src, idx) => (
            <img key={idx} src={src} alt="preview" className="h-24 w-full rounded object-cover" />
          ))}
        </div>
      )}
    </div>
  )
}
