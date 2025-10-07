import { useEffect } from 'react'
import { Chart, LineElement, BarElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement } from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import ProtectedLayout from '../../components/common/ProtectedLayout'
import api from '../../services/api'

Chart.register(LineElement, BarElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement)

export default function AdminDashboard() {
  useEffect(() => {
    // preload reports data via API if needed
  }, [])

  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{ label: 'Revenue', data: [12, 19, 3, 5, 2, 3], borderColor: '#16a34a', backgroundColor: 'rgba(22,163,74,0.2)' }],
  }
  const barData = {
    labels: ['Farm A', 'Farm B', 'Farm C'],
    datasets: [{ label: 'Top Farms', data: [120, 90, 70], backgroundColor: ['#16a34a', '#22c55e', '#15803d'] }],
  }
  const donutData = {
    labels: ['Activities', 'Guides', 'Transport'],
    datasets: [{ data: [60, 25, 15], backgroundColor: ['#16a34a', '#22c55e', '#15803d'] }],
  }

  return (
    <ProtectedLayout>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded border bg-white p-4">
            <h2 className="mb-2 font-medium">Monthly Revenue</h2>
            <Line data={lineData} options={{ responsive: true, maintainAspectRatio: false }} height={220} />
          </div>
          <div className="rounded border bg-white p-4">
            <h2 className="mb-2 font-medium">Top Performing Farms</h2>
            <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} height={220} />
          </div>
          <div className="rounded border bg-white p-4 md:col-span-2">
            <h2 className="mb-2 font-medium">Revenue by Service Type</h2>
            <div className="max-w-md">
              <Doughnut data={donutData} />
            </div>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  )
}
