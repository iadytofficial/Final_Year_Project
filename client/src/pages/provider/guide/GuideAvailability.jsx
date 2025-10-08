import { useEffect, useState } from 'react'
import ProtectedLayout from '../../../components/common/ProtectedLayout'
import api from '../../../services/api'

export default function GuideAvailability() {
  const [calendar, setCalendar] = useState([])
  useEffect(()=>{(async()=>{try{const {data}=await api.get('/calendar/availability/me');setCalendar(data||[])}catch{}})()},[])

  const save = async () => {
    await api.put('/guides/availability', { calendar })
  }

  return (
    <ProtectedLayout>
      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">Availability</h1>
        <div className="rounded border bg-white p-4">
          <pre className="text-sm">{JSON.stringify(calendar,null,2)}</pre>
          <button onClick={save} className="mt-3 rounded bg-brand px-4 py-2 text-white">Save</button>
        </div>
      </div>
    </ProtectedLayout>
  )
}
