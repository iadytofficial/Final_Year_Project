import ProtectedLayout from '../../components/common/ProtectedLayout'
import api from '../../services/api'
import { useEffect, useState } from 'react'

export default function AdminBookings(){
  const [items,setItems]=useState([])
  const [loading,setLoading]=useState(true)
  useEffect(()=>{(async()=>{try{setLoading(true); const {data}=await api.get('/admin/bookings'); setItems(data?.items||[])} finally { setLoading(false) }})()},[])
  return (
    <ProtectedLayout>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">Bookings</h1>
        {loading? <p>Loading...</p> : (
          <div className="overflow-x-auto rounded border bg-white">
            <table className="min-w-full text-sm">
              <thead><tr className="bg-gray-50"><th className="p-2 text-left">ID</th><th className="p-2 text-left">Date</th><th className="p-2 text-left">Participants</th><th className="p-2 text-left">Total</th><th className="p-2 text-left">Status</th></tr></thead>
              <tbody>
                {items.map((b)=>(
                  <tr key={b.BookingID||b._id} className="border-t">
                    <td className="p-2">{b.BookingID||b._id}</td>
                    <td className="p-2">{new Date(b.ActivityDate).toLocaleString()}</td>
                    <td className="p-2">{b.NumberOfParticipants}</td>
                    <td className="p-2">{b.TotalCost}</td>
                    <td className="p-2">{b.Status}</td>
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