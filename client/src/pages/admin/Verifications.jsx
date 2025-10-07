import ProtectedLayout from '../../components/common/ProtectedLayout'
import api from '../../services/api'
import { useEffect, useState } from 'react'

export default function Verifications() {
  const [items, setItems] = useState([])
  useEffect(()=>{(async()=>{const {data}=await api.get('/admin/verifications/pending'); setItems(data?.items||[])})()},[])
  const act = async (providerId, approve) => {
    await api.put(`/admin/verify/${providerId}`, { approve })
    setItems((arr)=>arr.filter((i)=> (i.ProviderUserID||i._id)!==providerId))
  }
  return (
    <ProtectedLayout>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">Pending Verifications</h1>
        <div className="space-y-3">
          {items.map((p)=> (
            <div key={p.ProviderUserID||p._id} className="rounded border bg-white p-3 flex items-center justify-between">
              <div>
                <p className="font-medium">{p.User?.FullName||p.FullName||'Provider'}</p>
                <p className="text-sm text-gray-600">{p.Type||p.Role}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={()=>act(p.ProviderUserID||p._id,true)} className="rounded bg-brand px-3 py-1 text-white">Approve</button>
                <button onClick={()=>act(p.ProviderUserID||p._id,false)} className="rounded border px-3 py-1">Reject</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ProtectedLayout>
  )
}
