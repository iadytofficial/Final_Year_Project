import ProtectedLayout from '../../components/common/ProtectedLayout'
import api from '../../services/api'
import { useEffect, useState } from 'react'

export default function ReviewsModeration() {
  const [items, setItems] = useState([])
  useEffect(()=>{(async()=>{const {data}=await api.get('/admin/reviews/pending'); setItems(data?.items||[])})()},[])
  const moderate = async (reviewId, action) => {
    await api.put(`/admin/reviews/${reviewId}/moderate`, { action })
    setItems((arr)=>arr.filter((r)=> (r.ReviewID||r._id)!==reviewId))
  }
  return (
    <ProtectedLayout>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">Reviews Moderation</h1>
        <div className="space-y-3">
          {items.map((r)=> (
            <div key={r.ReviewID||r._id} className="rounded border bg-white p-3">
              <p className="font-medium">Rating: {r.Rating}/5</p>
              <p className="text-sm text-gray-600">{r.Comment}</p>
              <div className="mt-2 flex gap-2">
                <button onClick={()=>moderate(r.ReviewID||r._id,'approve')} className="rounded bg-brand px-3 py-1 text-white">Approve</button>
                <button onClick={()=>moderate(r.ReviewID||r._id,'reject')} className="rounded border px-3 py-1">Reject</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ProtectedLayout>
  )
}
