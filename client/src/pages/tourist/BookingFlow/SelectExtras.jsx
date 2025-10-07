import { useEffect, useState } from 'react'
import api from '../../../services/api'

export default function SelectExtras({ activityId, value, onChange }){
  const [guide,setGuide]=useState(value?.guide||false)
  const [transport,setTransport]=useState(value?.transport||false)
  const [participants,setParticipants]=useState(value?.participants||1)

  useEffect(()=>{ onChange?.({ guide, transport, participants }) },[guide,transport,participants,onChange])

  return (
    <div className="space-y-4">
      <label className="flex items-center gap-2"><input type="checkbox" checked={guide} onChange={(e)=>setGuide(e.target.checked)} /> Request Tour Guide</label>
      <label className="flex items-center gap-2"><input type="checkbox" checked={transport} onChange={(e)=>setTransport(e.target.checked)} /> Request Transport</label>
      <div>
        <label className="block text-sm font-medium">Participants</label>
        <input type="number" min={1} value={participants} onChange={(e)=>setParticipants(Number(e.target.value))} className="mt-1 w-full rounded border px-3 py-2" />
      </div>
    </div>
  )
}