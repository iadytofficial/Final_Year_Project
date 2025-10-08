import ProtectedLayout from '../../components/common/ProtectedLayout'
import api from '../../services/api'
import { useEffect, useState } from 'react'

export default function AdminBookings(){
  const [items,setItems]=useState([])
  const [loading,setLoading]=useState(true)
  const updateStatus = async (id, status)=>{
    await api.put(`/admin/bookings/${id}/status`, { status })
    setItems((arr)=> arr.map((b)=> (b.BookingID||b._id)===id? { ...b, Status: status } : b))
  }
  useEffect(()=>{(async()=>{try{setLoading(true); const {data}=await api.get('/admin/bookings'); setItems(data?.items||[])} finally { setLoading(false) }})()},[])
  return (
    <ProtectedLayout>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">Bookings</h1>
        {loading? <p>Loading...</p> : (
          <div className="overflow-x-auto rounded border bg-white">
            <table className="min-w-full text-sm">
              <thead><tr className="bg-gray-50"><th className="p-2 text-left">ID</th><th className="p-2 text-left">Date</th><th className="p-2 text-left">Participants</th><th className="p-2 text-left">Total</th><th className="p-2 text-left">Status</th><th className="p-2 text-left">Actions</th></tr></thead>
              <tbody>
                {items.map((b)=>(
                  <tr key={b.BookingID||b._id} className="border-t">
                    <td className="p-2">{b.BookingID||b._id}</td>
                    <td className="p-2">{new Date(b.ActivityDate).toLocaleString()}</td>
                    <td className="p-2">{b.NumberOfParticipants}</td>
                    <td className="p-2">{b.TotalCost}</td>
                    <td className="p-2">{b.Status}</td>
                    <td className="p-2">
                      <div className="flex gap-2">
                        <button onClick={()=>updateStatus(b.BookingID||b._id,'Confirmed')} className="rounded border px-2 py-0.5 text-xs">Confirm</button>
                        <button onClick={()=>updateStatus(b.BookingID||b._id,'Completed')} className="rounded border px-2 py-0.5 text-xs">Complete</button>
                        <button onClick={()=>updateStatus(b.BookingID||b._id,'Cancelled')} className="rounded border px-2 py-0.5 text-xs">Cancel</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ProtectedLayout>
  )
}