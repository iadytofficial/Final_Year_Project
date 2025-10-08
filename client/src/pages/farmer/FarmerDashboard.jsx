import ProtectedLayout from '../../components/common/ProtectedLayout'
import api from '../../services/api'
import { useEffect, useState } from 'react'

export default function FarmerDashboard() {
  const [stats, setStats] = useState(null)
  useEffect(() => {
    async function run() {
      try {
        const { data } = await api.get('/farmers/dashboard-stats')
        setStats(data)
      } catch {}
    }
    run()
  }, [])

  return (
    <ProtectedLayout>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">Farmer Dashboard</h1>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded border bg-white p-4"><p className="text-sm text-gray-600">Bookings</p><p className="mt-2 text-2xl font-bold">{stats?.bookings || 0}</p></div>
          <div className="rounded border bg-white p-4"><p className="text-sm text-gray-600">Revenue</p><p className="mt-2 text-2xl font-bold">LKR {(stats?.revenue || 0).toLocaleString?.()}</p></div>
          <div className="rounded border bg-white p-4"><p className="text-sm text-gray-600">Activities</p><p className="mt-2 text-2xl font-bold">{stats?.activities || 0}</p></div>
          <div className="rounded border bg-white p-4"><p className="text-sm text-gray-600">Rating</p><p className="mt-2 text-2xl font-bold">{stats?.rating || '—'}</p></div>
        </div>
      </div>
    </ProtectedLayout>
  )
}
