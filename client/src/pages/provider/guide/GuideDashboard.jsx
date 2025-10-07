import ProtectedLayout from '../../../components/common/ProtectedLayout'
import api from '../../../services/api'
import { useEffect, useState } from 'react'

export default function GuideDashboard() {
  const [stats, setStats] = useState(null)
  useEffect(()=>{(async()=>{try{const {data}=await api.get('/guides/earnings'); setStats(data)}catch{}})()},[])
  return (
    <ProtectedLayout>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">Guide Dashboard</h1>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded border bg-white p-4"><p className="text-sm text-gray-600">Earnings</p><p className="mt-2 text-2xl font-bold">LKR {(stats?.total || 0).toLocaleString?.()}</p></div>
          <div className="rounded border bg-white p-4"><p className="text-sm text-gray-600">Pending Requests</p><p className="mt-2 text-2xl font-bold">{stats?.pending || 0}</p></div>
        </div>
      </div>
    </ProtectedLayout>
  )
}
