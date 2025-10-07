import { useEffect, useState } from 'react'
import ProtectedLayout from '../../components/common/ProtectedLayout'
import api from '../../services/api'

export default function NotificationsCenter() {
  const [items, setItems] = useState([])
  useEffect(()=>{(async()=>{const {data}=await api.get('/notifications'); setItems(data?.items||data||[])})()},[])
  const markAll = async ()=>{await api.put('/notifications/read-all'); setItems((arr)=>arr.map((n)=>({...n, IsRead:true})))}
  const markOne = async (id)=>{await api.put(`/notifications/${id}/read`); setItems((arr)=>arr.map((n)=> (n.NotificationID||n._id)===id? {...n, IsRead:true}:n))}
  return (
    <ProtectedLayout>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Notifications</h1>
          <button onClick={markAll} className="rounded border px-3 py-1">Mark all read</button>
        </div>
        <div className="space-y-2">
          {items.map((n)=> (
            <div key={n.NotificationID||n._id} className={`rounded border p-3 ${n.IsRead?'bg-white':'bg-brand/5'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{n.Type}</p>
                  <p className="text-sm text-gray-600">{n.Message}</p>
                </div>
                {!n.IsRead && <button onClick={()=>markOne(n.NotificationID||n._id)} className="rounded border px-3 py-1 text-sm">Mark read</button>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ProtectedLayout>
  )
}
