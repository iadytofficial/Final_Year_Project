import { useEffect, useState } from 'react'
import ProtectedLayout from '../../components/common/ProtectedLayout'
import api from '../../services/api'

export default function MyReviews(){
  const [items,setItems]=useState([])
  useEffect(()=>{(async()=>{const {data}=await api.get('/reviews/my-reviews'); setItems(data?.items||[])})()},[])
  return (
    <ProtectedLayout>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">My Reviews</h1>
        <div className="space-y-2">
          {items.map((r)=> (
            <div key={r.ReviewID||r._id} className="rounded border bg-white p-3">
              <p className="font-medium">Rating: {r.Rating}/5</p>
              <p className="text-sm text-gray-600">{r.Comment}</p>
              <p className="text-xs text-gray-500">Status: {r.ModerationStatus}</p>
            </div>
          ))}
        </div>
      </div>
    </ProtectedLayout>
  )
}