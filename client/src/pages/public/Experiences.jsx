import { useEffect, useState } from 'react'
import PublicLayout from './PublicLayout'
import api from '../../services/api'
import ActivityCard from '../../components/common/ActivityCard'

export default function Experiences(){
  const [items,setItems]=useState([])
  const [loading,setLoading]=useState(false)
  useEffect(()=>{(async()=>{setLoading(true);try{const {data}=await api.get('/search/activities'); setItems(data?.results||[])}finally{setLoading(false)}})()},[])
  return (
    <PublicLayout>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">Experiences</h1>
        {loading? <p>Loading...</p> : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {items.map((a)=> <ActivityCard key={a.ActivityID||a._id} activity={a} />)}
          </div>
        )}
      </div>
    </PublicLayout>
  )
}