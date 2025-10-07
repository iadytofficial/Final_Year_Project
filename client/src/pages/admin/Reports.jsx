import ProtectedLayout from '../../components/common/ProtectedLayout'
import { useEffect, useState } from 'react'
import api from '../../services/api'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import { Chart, LineElement, BarElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement } from 'chart.js'

Chart.register(LineElement, BarElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement)

export default function Reports() {
  const [revenue, setRevenue] = useState([])
  const [users, setUsers] = useState([])
  const [bookings, setBookings] = useState([])
  useEffect(()=>{(async()=>{
    const r = await api.get('/admin/reports/revenue'); setRevenue(r.data||[])
    const u = await api.get('/admin/reports/users'); setUsers(u.data||[])
    const b = await api.get('/admin/reports/bookings'); setBookings(b.data||[])
  })()},[])

  const revData = { labels: revenue.map(x=>x.month||x.label), datasets:[{label:'Revenue', data: revenue.map(x=>x.value||x.total), borderColor:'#16a34a', backgroundColor:'rgba(22,163,74,0.2)'}] }
  const usrData = { labels: users.map(x=>x.month||x.label), datasets:[{label:'Users', data: users.map(x=>x.count||x.value), backgroundColor:'#16a34a'}] }
  const bokData = { labels: bookings.map(x=>x.category||x.label), datasets:[{label:'Bookings', data: bookings.map(x=>x.count||x.value), backgroundColor:['#16a34a','#22c55e','#15803d']}] }
  const exportCsv = async (endpoint, filename) => {
    const res = await api.get(endpoint, { responseType: 'blob' })
    const url = window.URL.createObjectURL(new Blob([res.data]))
    const a = document.createElement('a'); a.href = url; a.download = filename; a.click(); window.URL.revokeObjectURL(url)
  }

  return (
    <ProtectedLayout>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">Reports</h1>
        <div className="mb-4 flex gap-2">
          <button onClick={()=>exportCsv('/export/bookings','bookings.csv')} className="rounded border px-3 py-1 text-sm">Export Bookings (CSV)</button>
          <button onClick={()=>exportCsv('/export/earnings','earnings.csv')} className="rounded border px-3 py-1 text-sm">Export Earnings (CSV)</button>
          <button onClick={()=>exportCsv('/export/users','users.csv')} className="rounded border px-3 py-1 text-sm">Export Users (CSV)</button>
          <button onClick={()=>exportCsv('/export/reviews','reviews.csv')} className="rounded border px-3 py-1 text-sm">Export Reviews (CSV)</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded border bg-white p-4"><h2 className="mb-2 font-medium">Revenue</h2><Line data={revData} height={220} /></div>
          <div className="rounded border bg-white p-4"><h2 className="mb-2 font-medium">User Growth</h2><Bar data={usrData} height={220} /></div>
          <div className="rounded border bg-white p-4 md:col-span-2"><h2 className="mb-2 font-medium">Bookings</h2><Doughnut data={bokData} /></div>
        </div>
      </div>
    </ProtectedLayout>
  )
}
