import { useEffect, useState } from 'react'
import { getSocket } from '../../services/socket'

export default function NotificationBell() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const s = getSocket()
    const onNotify = () => setCount((c) => c + 1)
    s.on('notification', onNotify)
    return () => s.off('notification', onNotify)
  }, [])

  return (
    <button className="relative rounded border px-2 py-1">
      🔔
      {count > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-red-600 px-1 text-xs text-white">{count}</span>}
    </button>
  )
}
