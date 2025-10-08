import { Bar } from 'react-chartjs-2'
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

export default function RatingBreakdown({ distribution = {}, subratings = {} }) {
  const labels = ['5', '4', '3', '2', '1']
  const counts = labels.map((l) => distribution[l] || distribution[Number(l)] || 0)
  const data = { labels, datasets: [{ label: 'Ratings', data: counts, backgroundColor: '#f59e0b' }] }

  return (
    <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="rounded border bg-white p-4">
        <h3 className="mb-2 font-medium">Rating Distribution</h3>
        <Bar data={data} options={{ responsive: true, plugins: { legend: { display: false } } }} />
      </div>
      {Object.keys(subratings).length > 0 && (
        <div className="rounded border bg-white p-4">
          <h3 className="mb-2 font-medium">Sub-ratings</h3>
          <ul className="space-y-1 text-sm">
            {Object.entries(subratings).map(([k, v]) => (
              <li key={k} className="flex items-center justify-between"><span className="capitalize">{k.replace(/([A-Z])/g,' $1').trim()}</span><span>{v?.toFixed?.(1) ?? v}/5</span></li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
