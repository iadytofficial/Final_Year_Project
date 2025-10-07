import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function SearchBar() {
  const [q, setQ] = useState('')
  const navigate = useNavigate()

  const onSubmit = (e) => {
    e.preventDefault()
    const params = new URLSearchParams({ q })
    navigate(`/search?${params.toString()}`)
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-xl items-center gap-2">
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search activities..." className="w-full rounded border px-3 py-2" />
      <button className="rounded bg-brand px-3 py-2 text-white">Search</button>
    </form>
  )
}
