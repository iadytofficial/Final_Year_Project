import { useEffect, useState } from 'react'
import ProtectedLayout from '../../../components/common/ProtectedLayout'
import api from '../../../services/api'

export default function GuideRequests() {
  const [items, setItems] = useState([])
  useEffect(()=>{(async()=>{const {data}=await api.get('/guides/booking-requests'); setItems(data?.items||data||[])})()},[])

  const respond = async (bookingId, accept) => {
    await api.put(`/guides/booking/${bookingId}/respond`, { accept })
    setItems((list)=>list.filter((b)=> (b.BookingID||b._id)!==bookingId))
  }

  return (
    <ProtectedLayout>
      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">Guide Requests</h1>
        <div className="space-y-3">
          {items.map((b)=>(
            <div key={b.BookingID||b._id} className="rounded border bg-white p-3 flex items-center justify-between">
              <div>
                <p className="font-medium">Booking {b.BookingID||b._id}</p>
                <p className="text-sm text-gray-600">{new Date(b.ActivityDate).toLocaleString()}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={()=>respond(b.BookingID||b._id,true)} className="rounded bg-brand px-3 py-1 text-white">Accept</button>
                <button onClick={()=>respond(b.BookingID||b._id,false)} className="rounded border px-3 py-1">Decline</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ProtectedLayout>
  )
}
