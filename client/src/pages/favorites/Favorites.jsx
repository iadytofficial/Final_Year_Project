import { useEffect, useState } from 'react'
import ProtectedLayout from '../../components/common/ProtectedLayout'
import api from '../../services/api'
import ActivityCard from '../../components/common/ActivityCard'

export default function Favorites() {
  const [items, setItems] = useState([])
  useEffect(()=>{(async()=>{const {data}=await api.get('/favorites/list'); setItems(data?.items||[])})()},[])
  return (
    <ProtectedLayout>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">Favorites</h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {items.map((f)=> <ActivityCard key={f.ActivityID||f._id} activity={f.Activity||f} />)}
        </div>
      </div>
    </ProtectedLayout>
  )
}
