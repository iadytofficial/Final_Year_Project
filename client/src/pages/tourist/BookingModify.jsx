import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import ProtectedLayout from '../../components/common/ProtectedLayout'
import api from '../../services/api'
import { toast } from 'react-toastify'

export default function BookingModify(){
  const { id } = useParams()
  const [booking,setBooking]=useState(null)
  const [date,setDate]=useState('')
  const [participants,setParticipants]=useState(1)
  const [availability,setAvailability]=useState(null)
  const unitPrice = useMemo(()=>{
    if (!booking) return 0
    const p = Number(booking.TotalCost||0)/Number(booking.NumberOfParticipants||1)
    return isFinite(p) ? p : 0
  },[booking])
  const estimatedTotal = useMemo(()=> Number((unitPrice*participants).toFixed(2)),[unitPrice,participants])

  useEffect(()=>{(async()=>{const {data}=await api.get('/bookings/my-bookings'); const b=(data?.items||data||[]).find(x=> (x.BookingID||x._id)===id); setBooking(b); setDate(b? new Date(b.ActivityDate).toISOString().slice(0,10):''); setParticipants(b?.NumberOfParticipants||1)})()},[id])

  useEffect(()=>{(async()=>{
    try{
      if (!booking) return
      const payload = { activityId: booking.ActivityID||booking.activityId, date, slot: booking.Slot||booking.slot, participants }
      const { data } = await api.post('/bookings/check-availability', payload)
      setAvailability(data)
    } catch { setAvailability(null) }
  })()},[booking,date,participants])

  const submit = async ()=>{
    try{
      const payload = { ActivityDate: date, NumberOfParticipants: participants }
      await api.put(`/bookings/${id}/modify`, payload)
      toast.success('Modification requested')
    } catch { toast.error('Failed to modify') }
  }

  if (!booking) return <ProtectedLayout><div className="p-6">Loading...</div></ProtectedLayout>
  return (
    <ProtectedLayout>
      <div className="mx-auto max-w-md px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">Modify Booking</h1>
        <div className="space-y-3">
          <label className="block text-sm font-medium">Date</label>
          <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} className="w-full rounded border px-3 py-2" />
          <label className="block text-sm font-medium">Participants</label>
          <input type="number" min={1} value={participants} onChange={(e)=>setParticipants(Number(e.target.value))} className="w-full rounded border px-3 py-2" />
          {availability && (
            <div className="rounded border bg-white p-3 text-sm">
              <p>Available: {availability.available? 'Yes':'No'} (Remaining: {availability.remaining ?? '—'})</p>
              <p className="mt-1">Estimated total: LKR {estimatedTotal.toLocaleString?.()||estimatedTotal}</p>
            </div>
          )}
          <button onClick={submit} disabled={availability && availability.available===false} className="rounded bg-brand px-4 py-2 text-white disabled:opacity-50">Submit</button>
        </div>
      </div>
    </ProtectedLayout>
  )
}