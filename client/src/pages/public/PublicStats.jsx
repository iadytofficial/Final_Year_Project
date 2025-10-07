import PublicLayout from './PublicLayout'
import api from '../../services/api'
import { useEffect, useState } from 'react'
import Map from '../../components/common/Map'

export default function PublicStats() {
  const [stats, setStats] = useState(null)
  const [destinations, setDestinations] = useState([])
  useEffect(()=>{(async()=>{const s = await api.get('/public/statistics'); setStats(s.data); const d = await api.get('/public/destinations'); setDestinations(d.data?.items||[])})()},[])
  return (
    <PublicLayout>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">Platform Statistics</h1>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded border bg-white p-4"><p className="text-sm text-gray-600">Active Farms</p><p className="mt-2 text-2xl font-bold">{stats?.activeFarms||0}</p></div>
          <div className="rounded border bg-white p-4"><p className="text-sm text-gray-600">Completed Bookings</p><p className="mt-2 text-2xl font-bold">{stats?.completedBookings||0}</p></div>
          <div className="rounded border bg-white p-4"><p className="text-sm text-gray-600">Avg Rating</p><p className="mt-2 text-2xl font-bold">{stats?.averageRating||'—'}</p></div>
          <div className="rounded border bg-white p-4"><p className="text-sm text-gray-600">Environmental Impact</p><p className="mt-2 text-2xl font-bold">{stats?.impactIndex||'—'}</p></div>
        </div>
        <div className="mt-8">
          <h2 className="mb-2 font-medium">Popular Destinations</h2>
          <div className="h-80"><Map center={{lat:7.8731,lng:80.7718}} markers={destinations.map(d=>({position:{lat:d.lat,lng:d.lng}}))} /></div>
        </div>
      </div>
    </PublicLayout>
  )
}
