import ProtectedLayout from '../../components/common/ProtectedLayout'
import api from '../../services/api'
import { useEffect, useState } from 'react'

export default function FeedbackManagement() {
  const [items, setItems] = useState([])
  useEffect(()=>{(async()=>{const {data}=await api.get('/admin/feedback'); setItems(data?.items||[])})()},[])
  const respond = async (feedbackId) => {
    const msg = prompt('Response message')
    if (!msg) return
    await api.put(`/admin/feedback/${feedbackId}/respond`, { message: msg })
  }
  return (
    <ProtectedLayout>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">Feedback</h1>
        <div className="space-y-3">
          {items.map((f)=> (
            <div key={f.FeedbackID||f._id} className="rounded border bg-white p-3">
              <p className="font-medium">{f.Category}</p>
              <p className="text-sm text-gray-600">{f.Message}</p>
              <button onClick={()=>respond(f.FeedbackID||f._id)} className="mt-2 rounded border px-3 py-1">Respond</button>
            </div>
          ))}
        </div>
      </div>
    </ProtectedLayout>
  )
}
