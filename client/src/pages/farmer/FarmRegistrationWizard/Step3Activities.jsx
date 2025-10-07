import { useState } from 'react'

export default function Step3Activities({ defaultValues = [], onSubmit }) {
  const [activities, setActivities] = useState(defaultValues)

  const addActivity = () => setActivities((a) => [...a, { CustomTitle: '', PricePerPerson: 0 }])
  const update = (idx, key, value) => setActivities((list) => list.map((it, i) => i===idx? { ...it, [key]: value } : it))
  const remove = (idx) => setActivities((list) => list.filter((_, i) => i!==idx))

  return (
    <form onSubmit={(e)=>{e.preventDefault(); onSubmit(activities)}} className="space-y-4">
      <div className="flex justify-between">
        <h3 className="font-medium">Activities</h3>
        <button type="button" onClick={addActivity} className="rounded border px-3 py-1">Add</button>
      </div>
      <div className="space-y-3">
        {activities.map((a, idx) => (
          <div key={idx} className="rounded border p-3">
            <div className="grid grid-cols-2 gap-3">
              <input value={a.CustomTitle} onChange={(e)=>update(idx,'CustomTitle',e.target.value)} placeholder="Title" className="rounded border px-3 py-2" />
              <input type="number" value={a.PricePerPerson} onChange={(e)=>update(idx,'PricePerPerson',Number(e.target.value))} placeholder="Price per person" className="rounded border px-3 py-2" />
            </div>
            <button type="button" onClick={()=>remove(idx)} className="mt-2 text-sm text-red-600">Remove</button>
          </div>
        ))}
      </div>
    </form>
  )
}
