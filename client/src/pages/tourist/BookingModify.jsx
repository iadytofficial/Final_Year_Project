import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ProtectedLayout from '../../components/common/ProtectedLayout'
import api from '../../services/api'
import { toast } from 'react-toastify'

export default function BookingModify(){
  const { id } = useParams()
  const [booking,setBooking]=useState(null)
  const [date,setDate]=useState('')
  const [participants,setParticipants]=useState(1)

  useEffect(()=>{(async()=>{const {data}=await api.get('/bookings/my-bookings'); const b=(data?.items||data||[]).find(x=> (x.BookingID||x._id)===id); setBooking(b); setDate(b? new Date(b.ActivityDate).toISOString().slice(0,10):''); setParticipants(b?.NumberOfParticipants||1)})()},[id])

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
          <button onClick={submit} className="rounded bg-brand px-4 py-2 text-white">Submit</button>
        </div>
      </div>
    </ProtectedLayout>
  )
}