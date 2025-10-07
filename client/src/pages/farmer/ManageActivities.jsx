import { useEffect, useState } from 'react'
import ProtectedLayout from '../../components/common/ProtectedLayout'
import api from '../../services/api'

export default function ManageActivities() {
  const [items, setItems] = useState([])

  useEffect(() => {
    async function run() {
      const { data } = await api.get('/activities/my-activities')
      setItems(data?.items || data || [])
    }
    run()
  }, [])

  return (
    <ProtectedLayout>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">My Activities</h1>
          <a href="/farmer/activities/create" className="rounded bg-brand px-4 py-2 text-white">Add Activity</a>
        </div>
        <div className="space-y-3">
          {items.map((a) => (
            <div key={a.ActivityID || a._id} className="rounded border bg-white p-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{a.CustomTitle}</h3>
                  <p className="text-sm text-gray-600">LKR {a.PricePerPerson}</p>
                </div>
                <div className="flex gap-2">
                  <a href={`/farmer/activities/${a.ActivityID || a._id}/edit`} className="rounded border px-3 py-1">Edit</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ProtectedLayout>
  )
}
