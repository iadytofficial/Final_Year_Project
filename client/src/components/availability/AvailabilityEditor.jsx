import { useEffect, useState } from 'react'
import api from '../../services/api'

const DEFAULT_SLOTS = [
  { key: 'morning', label: 'Morning', capacity: 10 },
  { key: 'afternoon', label: 'Afternoon', capacity: 10 },
  { key: 'evening', label: 'Evening', capacity: 10 },
  { key: 'fullday', label: 'Full Day', capacity: 20 },
]

export default function AvailabilityEditor({ entityType='Activity', entityId }) {
  const [slots, setSlots] = useState(DEFAULT_SLOTS)
  const [blackoutDates, setBlackoutDates] = useState([])
  const [season, setSeason] = useState({ start: '', end: '' })

  useEffect(()=>{(async()=>{
    try { const { data } = await api.get('/calendar/blackout-dates'); setBlackoutDates(data?.dates||[]) } catch {}
  })()},[])

  const save = async () => {
    const payload = { entityType, entityId, slots, blackoutDates, season }
    await api.put('/calendar/bulk-update', payload)
  }

  const updateSlot = (key, updates) => setSlots((s)=> s.map((it)=> it.key===key? { ...it, ...updates } : it))

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium">Time Slots</h3>
        <div className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-2">
          {slots.map((s)=> (
            <div key={s.key} className="rounded border bg-white p-3">
              <p className="font-medium">{s.label}</p>
              <label className="mt-2 block text-sm">Capacity</label>
              <input type="number" value={s.capacity} onChange={(e)=>updateSlot(s.key,{capacity:Number(e.target.value)})} className="mt-1 w-full rounded border px-3 py-2" />
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-medium">Seasonal Availability</h3>
        <div className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-2">
          <input type="date" value={season.start} onChange={(e)=>setSeason((x)=>({...x,start:e.target.value}))} className="rounded border px-3 py-2" />
          <input type="date" value={season.end} onChange={(e)=>setSeason((x)=>({...x,end:e.target.value}))} className="rounded border px-3 py-2" />
        </div>
      </div>
      <div>
        <h3 className="font-medium">Blackout Dates</h3>
        <textarea value={blackoutDates.join('\n')} onChange={(e)=>setBlackoutDates(e.target.value.split('\n').filter(Boolean))} rows={6} className="mt-2 w-full rounded border px-3 py-2" />
        <p className="mt-1 text-xs text-gray-500">Enter one date per line (YYYY-MM-DD)</p>
      </div>
      <div className="text-right">
        <button onClick={save} className="rounded bg-brand px-4 py-2 text-white">Save</button>
      </div>
    </div>
  )
}
