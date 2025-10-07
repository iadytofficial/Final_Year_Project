import { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import api from '../../../services/api'

export default function SelectDateTime({ activityId, value, onChange }) {
  const [date, setDate] = useState(value?.date || null)
  const [slots, setSlots] = useState([])
  const [slot, setSlot] = useState(value?.slot || '')

  useEffect(() => {
    async function fetchAvailability() {
      if (!date) return
      const { data } = await api.post('/bookings/check-availability', { activityId, date })
      setSlots(data?.slots || [])
    }
    fetchAvailability()
  }, [activityId, date])

  useEffect(() => {
    onChange?.({ date, slot })
  }, [date, slot, onChange])

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Select date</label>
        <DatePicker selected={date} onChange={setDate} minDate={new Date()} className="mt-1 w-full rounded border px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium">Select time slot</label>
        <select value={slot} onChange={(e) => setSlot(e.target.value)} className="mt-1 w-full rounded border px-3 py-2">
          <option value="">Choose a slot</option>
          {slots.map((s) => (
            <option key={s.id || s} value={s.id || s}>{s.label || s}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
