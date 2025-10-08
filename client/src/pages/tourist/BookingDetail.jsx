import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ProtectedLayout from '../../components/common/ProtectedLayout'
import api from '../../services/api'
import { toast } from 'react-toastify'

export default function BookingDetail(){
  const { id } = useParams()
  const [booking,setBooking]=useState(null)
  const [loading,setLoading]=useState(true)

  useEffect(()=>{(async()=>{try{setLoading(true); const {data}=await api.get('/bookings/my-bookings'); const b=(data?.items||data||[]).find(x=> (x.BookingID||x._id)===id); setBooking(b)} finally {setLoading(false)}})()},[id])

  const cancel = async ()=>{ try{ await api.put(`/bookings/${id}/cancel`); toast.success('Cancellation requested'); } catch { toast.error('Cannot cancel') } }
  const requestCancellation = async ()=>{ try{ await api.post(`/bookings/${id}/request-cancellation`); toast.success('Cancellation requested') } catch { toast.error('Failed') } }

  if (loading) return <ProtectedLayout><div className="p-6">Loading...</div></ProtectedLayout>
  if (!booking) return <ProtectedLayout><div className="p-6">Booking not found</div></ProtectedLayout>

  return (
    <ProtectedLayout>
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">Booking Details</h1>
        <div className="rounded border bg-white p-4 text-sm">
          <p><span className="font-medium">ID:</span> {booking.BookingID||booking._id}</p>
          <p><span className="font-medium">Date:</span> {new Date(booking.ActivityDate).toLocaleString()}</p>
          <p><span className="font-medium">Participants:</span> {booking.NumberOfParticipants}</p>
          <p><span className="font-medium">Total:</span> LKR {booking.TotalCost?.toLocaleString?.()||booking.TotalCost}</p>
          <p><span className="font-medium">Status:</span> {booking.Status}</p>
        </div>
        <div className="mt-4 flex gap-2">
          <button onClick={requestCancellation} className="rounded border px-3 py-1">Request Cancellation</button>
          <button onClick={cancel} className="rounded border px-3 py-1">Cancel</button>
        </div>
      </div>
    </ProtectedLayout>
  )
}